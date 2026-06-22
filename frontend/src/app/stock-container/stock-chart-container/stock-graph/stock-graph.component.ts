import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { SharedModule } from '../../../shared/shared.module';
import { StockSharedService } from '../../../shared/services/stocks/stockShared.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock-graph',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-graph.component.html',
  styleUrl: './stock-graph.component.scss',
})
export class StockGraphComponent implements OnInit {
  chartOption: EChartsOption = {};
  
  dataValues = [];
  timeValues = [];
  loadingGraph = true;

  graphForm!: FormGroup;

  periods = [
        {"value": "1d", "placeholder": "1 Day"},
        {"value": "5d", "placeholder": "5 Days"},
        {"value": "1mo", "placeholder": "1 Month"},
        {"value": "3mo", "placeholder": "3 Months"},
        {"value": "6mo", "placeholder": "6 Months"},
        {"value": "1y", "placeholder": "1 Year"},
        {"value": "2y", "placeholder": "2 Years"},
        {"value": "5y", "placeholder": "5 Years"},
        {"value": "10y", "placeholder": "10 Years"},
        {"value": "ytd", "placeholder": "Year to Date"},
        {"value": "max", "placeholder": "Entire available history"}
    ]
  intervals = [
        {"value": "1m", "placeholder": "1 Minute"},
        {"value": "2m", "placeholder": "2 Minutes"},
        {"value": "5m", "placeholder": "5 Minutes"},
        {"value": "15m", "placeholder": "15 Minutes"},
        {"value": "30m", "placeholder": "30 Minutes"},
        {"value": "60m", "placeholder": "60 Minutes"},
        {"value": "90m", "placeholder": "90 Minutes"},
        {"value": "1h", "placeholder": "1 Hour"},
        {"value": "1d", "placeholder": "1 Day"},
        {"value": "5d", "placeholder": "5 Days"},
        {"value": "1wk", "placeholder": "1 Week"},
        {"value": "1mo", "placeholder": "1 Month"},
        {"value": "3mo", "placeholder": "3 Months"}
    ]

  constructor(private sharedService: StockSharedService){}

  ngOnInit(): void {
    this.graphForm = new FormGroup({
      period: new FormControl('1mo'),
      interval: new FormControl('1d'),
    })
    this.sharedService.selectedStockDataEmitter.subscribe(
      (resp) => {
        this.dataValues = resp.map((obj: any) => obj['Close'])
        this.timeValues = resp.map((obj: any) => 'Datetime' in obj ? obj['Datetime'].split('+')[0] : obj['Date'])
        this.setGraphSeries();
        this.loadingGraph = false;
      } 
    )
    this.setGraphSeries();
  }
  setGraphSeries() {
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // White background
        borderColor: '#e2e8f0',                       // Light gray border
        borderWidth: 1,
        textStyle: {
          color: '#1e293b'                             // Dark text color
        },
        // Optional: Smoothly transition the tooltip box as the mouse moves
        transitionDuration: 0.3, 
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },

      xAxis: {
        type: 'category',
        data: this.timeValues,
        boundaryGap: false,
        axisLine: {
          show: true,
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },
      },

      series: [
        {
          type: 'line',
          symbol: 'none',
          data: this.dataValues,

          lineStyle: {
            width: 2,
            color: '#22c55e',
          },

          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(34,197,94,0.4)', // top
                },
                {
                  offset: 1,
                  color: 'rgba(34,197,94,0)', // bottom
                },
              ],
            },
          },
        },
      ],
    };
  }

  reloadGraph(){
    let formValues = this.graphForm.value;
    this.sharedService.getStockHistroicalValue(formValues);
  }
}
