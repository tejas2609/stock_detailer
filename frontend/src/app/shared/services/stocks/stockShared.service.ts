import { Injectable } from "@angular/core";
import { StockHttpService } from "./stockhttp.service";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
    providedIn: 'root'
})

export class StockSharedService {
    selectedStock: string = '';
    stocks: any = [];
    stocksEmitter = new Subject<any[]>();

    constructor(private stockHttpService: StockHttpService) { }

    setSelectedStock(stock: string) {
        this.selectedStock = stock;
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