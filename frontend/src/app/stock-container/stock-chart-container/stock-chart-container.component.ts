import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { StockSharedService } from '../../shared/services/stocks/stockShared.service';
import { StockGraphComponent } from "./stock-graph/stock-graph.component";
import { StockListerComponent } from "../stock-lister/stock-lister.component";

@Component({
  selector: 'app-stock-chart-container',
  standalone: true,
  imports: [SharedModule, StockDetailsComponent, StockGraphComponent, StockListerComponent],
  templateUrl: './stock-chart-container.component.html',
  styleUrl: './stock-chart-container.component.scss'
})
export class StockChartContainerComponent implements OnInit{
  details: {'key': string, 'value': string}[] = []

  constructor(private stockSharedService: StockSharedService){}

  ngOnInit(): void {
    this.stockSharedService.selectedStockDetailsEmitter.subscribe((resp) => {
      this.details = resp
    })
    this.details = [
      {
        'key': 'Key 1',
        'value': 'Value 1'
      },
      {
        'key': 'Key 1',
        'value': 'Value 1'
      },
      {
        'key': 'Key 1',
        'value': 'Value 1'
      },
      {
        'key': 'Key 1',
        'value': 'Value 1'
      }
    ]
  }
}
