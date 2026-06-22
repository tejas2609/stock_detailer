import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { StockSharedService } from '../../shared/services/stocks/stockShared.service';
import { StockGraphComponent } from "./stock-graph/stock-graph.component";
import { StockListerComponent } from "../stock-lister/stock-lister.component";
import { GraphContainerComponent } from "../../graph-container/graph-container.component";
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-stock-chart-container',
  standalone: true,
  imports: [SharedModule, StockDetailsComponent, StockGraphComponent, StockListerComponent, GraphContainerComponent, PieChartComponent],
  templateUrl: './stock-chart-container.component.html',
  styleUrl: './stock-chart-container.component.scss'
})
export class StockChartContainerComponent implements OnInit{
  details: {'key': string, 'value': string}[] = []
  changeView: boolean = false

  constructor(private stockSharedService: StockSharedService){}

  ngOnInit(): void {
    this.stockSharedService.stockViewGraphEmitter.subscribe((resp) =>{
      this.changeView = !this.changeView;
    })
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
