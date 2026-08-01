import { Injectable } from "@angular/core";
import { StockHttpService } from "../stocks/stockhttp.service";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
    providedIn: 'root'
})

export class StockNewsService {

    stockNews: any = {};
    stockNewsEmitter = new Subject<any>();

    constructor(private httpService: StockHttpService) { }

    getStockNews(stock: string) {
        this.httpService.getStockNews(stock).subscribe({
            next: (news: any) => {
                this.stockNews = 'news_data' in news ? news['news_data'] : {};
                this.stockNewsEmitter.next(this.stockNews);
            }, error: (err) => {
                console.error(err);
            }
        });
    }

    getStoredNews(){
        return this.stockNews;
    }
}