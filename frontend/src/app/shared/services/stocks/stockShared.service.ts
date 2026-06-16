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

    constructor(private stockHttpService: StockHttpService) { }

    setSelectedStock(stock: string) {
        this.selectedStock = stock;
        this.selectedStockEmitter.next(stock);
        this.stockHttpService.getStockDetails(stock + '.NS').subscribe((resp) => {
            this.selectedStockDetails = 'data' in resp ? resp['data'] : {}
            this.selectedStockDetailsEmitter.next(this.selectedStockDetails)
        })
        this.stockHttpService.getStockValues(stock + '.NS', '1m', '3d').subscribe((resp) => {
            this.selectedStockData = 'data' in resp ? resp['data'] : {}
            this.selectedStockDataEmitter.next(this.selectedStockData)
        })
    }
    getSelectedStock(): string {
        return this.selectedStock;
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