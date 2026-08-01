import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StockSharedService } from '../../shared/services/stocks/stockShared.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkVirtualScrollViewport, CdkVirtualForOf } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-stock-lister',
  standalone: true,
  imports: [SharedModule, ScrollingModule, CdkVirtualForOf, CdkVirtualScrollViewport],
  templateUrl: './stock-lister.component.html',
  styleUrl: './stock-lister.component.scss'
})
export class StockListerComponent implements OnInit{

  isStockSelected: boolean = false;
  stocks: any = []

  isOpen = false;

  searchText = '';

  selectedOption = '';

  filteredStocks: any = []

  constructor(private sharedService: StockSharedService) { }

  ngOnInit(): void {
    this.stocks = this.sharedService.getStoredStocks() ?? [];
    this.filteredStocks = [...this.stocks];

    this.sharedService.getAllStocks();

    this.sharedService.stocksEmitter.subscribe((stocks) => {
      this.stocks = Array.isArray(stocks) ? stocks : [];
      this.filteredStocks = [...this.stocks];
    });
  }

  selectStock(value: any) {
    this.isOpen = false;
    this.sharedService.setSelectedStock(value);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  filterOptions() {
    const value = this.searchText.toLowerCase();
    this.filteredStocks = this.stocks.filter((option: any) => {
      const symbol = option?.['symbol'];
      return symbol ? symbol.toLowerCase().includes(value) : false;
  });
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isOpen = false;
    this.searchText = '';
    this.filteredStocks = [...this.stocks];
  }

  trackBySymbol(index: number, stock: any): string {
    return stock?.symbol || index.toString();
  }
}
