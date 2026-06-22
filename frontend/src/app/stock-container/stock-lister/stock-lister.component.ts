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
    this.stocks = this.sharedService.getStoredStocks()
    this.sharedService.stocksEmitter.subscribe((stocks) => {
      this.stocks = stocks;
    });
  }

  selectStock(event: any) {
    this.sharedService.setSelectedStock(event.target.value);
  }
}
