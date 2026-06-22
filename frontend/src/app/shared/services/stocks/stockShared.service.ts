import { Injectable } from "@angular/core";
import { StockHttpService } from "./stockhttp.service";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
    providedIn: 'root'
})

export class StockSharedService {
    selectedStock: string = '';
    selectedStockEmitter = new Subject<string>();
    stocks: any = [];
    stocksEmitter = new Subject<any[]>();
    selectedStockDetails: any;
    selectedStockDetailsEmitter = new Subject<any>();
    selectedStockData: any = [];
    selectedStockDataEmitter = new Subject<any>();
    selectedStockFinancials: any = {}
    selectedStockFinancialsEmitter = new Subject<any>();
    isStockViewGraph: boolean = false
    stockViewGraphEmitter = new Subject<boolean>();

    constructor(private stockHttpService: StockHttpService) { }

    setStockGraphView(){
        this.isStockViewGraph = !this.isStockViewGraph;
        this.stockViewGraphEmitter.next(this.isStockViewGraph);
    }
    setSelectedStock(stock: string) {
        this.selectedStock = stock;
        this.selectedStockEmitter.next(stock);
        this.stockHttpService.getStockDetails(stock + '.NS').subscribe((resp) => {
            this.selectedStockDetails = 'data' in resp ? resp['data'] : {}
            this.selectedStockDetailsEmitter.next(this.selectedStockDetails)
        })
        this.getStockHistroicalValue({period: '1mo', interval: '5d'});
    }
    getStockHistroicalValue(obj: any){
        this.stockHttpService.getStockValues(this.selectedStock + '.NS', obj.period, obj.interval).subscribe((resp) => {
            let data: any = 'data' in resp ? resp['data'] : {};
            this.selectedStockData = data['data'];
            this.selectedStockFinancials = data['financials'];
            this.selectedStockDataEmitter.next(this.selectedStockData);
            this.selectedStockFinancialsEmitter.next(this.selectedStockFinancials);
        })
    }
    getSelectedStock(): string {
        return this.selectedStock;
    }

    getStoredStocks(){
        return this.stocks;
    }

    getAllStocks() {
        this.stockHttpService.getStocks('NSE').subscribe({
            next: (stocks: any) => {
                this.stocks = stocks['stocks']['stocks'];
                this.stocksEmitter.next(this.stocks);
            }, error: (err) => {
                console.error('Error fetching stocks:', err);
            }
        });
        
    }
}