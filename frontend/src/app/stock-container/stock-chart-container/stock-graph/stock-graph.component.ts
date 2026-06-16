import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-stock-graph',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-graph.component.html',
  styleUrl: './stock-graph.component.scss',
})
export class StockGraphComponent implements OnInit {
  chartOption: EChartsOption = {};

  ngOnInit(): void {
    this.setGraphSeries();
  }
  setGraphSeries() {
    this.chartOption = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },

      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
          smooth: true,
          symbol: 'none',
          data: [2420, 2510, 2470, 2680, 2810, 2960],

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
}
