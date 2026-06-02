import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StockSharedService } from '../../shared/services/stocks/stockShared.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-stock-lister',
  standalone: true,
  imports: [SharedModule, ScrollingModule],
  templateUrl: './stock-lister.component.html',
  styleUrl: './stock-lister.component.scss'
})
export class StockListerComponent implements OnInit{

  isStockSelected: boolean = false;
  stocks: any = []

  constructor(private sharedService: StockSharedService) { }

  ngOnInit(): void {
    // const socket = new WebSocket("ws://localhost:8000/ws/stocks");

    // socket.onopen = () => {
    //   socket.send(
    //     JSON.stringify({
    //       action: "subscribe",
    //       symbol: "TATA POWER"
    //     })
    //   );
    // };

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log(data);
    // };


    // this.isStockSelected = this.sharedService.getSelectedStock() ? true : false;
    // if (!this.isStockSelected) {
    //   this.sharedService.getAllStocks();
    // }
    // this.sharedService.stocksEmitter.subscribe((stocks) => {
    //   console.log('Received stocks:', this.stocks);
    //   this.stocks = stocks;
    // });
  }

  onScroll(event: any){
    const element = event.target as HTMLElement;
    // Check if the user reached the bottom of the container
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

  }
}
