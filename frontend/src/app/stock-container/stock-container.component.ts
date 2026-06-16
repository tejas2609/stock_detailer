import { Component, OnInit } from '@angular/core';
import { StockListerComponent } from './stock-lister/stock-lister.component';
import { SharedModule } from '../shared/shared.module';
import { StockSharedService } from '../shared/services/stocks/stockShared.service';
import { StockChartContainerComponent } from './stock-chart-container/stock-chart-container.component';

@Component({
  selector: 'app-stock-container',
  standalone: true,
  imports: [StockListerComponent, SharedModule, StockChartContainerComponent],
  templateUrl: './stock-container.component.html',
  styleUrl: './stock-container.component.scss'
})
export class StockContainerComponent implements OnInit {
  
  isStockSelected: boolean = true;

  constructor(private sharedService: StockSharedService) {}
  
  ngOnInit(): void {
    // this.isStockSelected = this.sharedService.getSelectedStock() ? true : false;
    // this.sharedService.selectedStockEmitter.subscribe((stock) => {
    //   this.isStockSelected = stock ? true : false;
    // });
  }
}
