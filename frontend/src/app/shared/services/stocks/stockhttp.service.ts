import { Injectable } from "@angular/core";
import { environment } from "../../../../environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError } from "rxjs/internal/operators/catchError";

@Injectable({
    providedIn: 'root'
})
export class StockHttpService {

    backendURL = environment.backend;

    constructor(private http: HttpClient) { }

    getStocks(exchange: string){
        return this.http.get(`${this.backendURL}/stocks`, {params: {exchange: exchange}}).pipe(
            catchError(this.handleError)
        );
    }

    getStockDetails(stock: string){
        return this.http.get(`${this.backendURL}/stock/data/details`, {params: {symbol: stock}}).pipe(
            catchError(this.handleError)
        );
    }

    getStockValues(stock: string, period: string, interval: string){
        return this.http.get(`${this.backendURL}/stock/data/history`, {params: {symbol: stock, interval: interval, period: period}}).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMsg = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            errorMsg = `Client Error: ${error.error.message}`;
        } else {
            errorMsg = `Server Error: ${error.status} - ${error.message}`;
        }
        console.error(errorMsg);
        return throwError(() => new Error(errorMsg));
  }

}