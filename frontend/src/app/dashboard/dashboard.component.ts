import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  categoryChartOption: EChartsOption = {};
  dummychartOption: EChartsOption = {};

  ngOnInit(): void {
    this.designChartOptions();
    this.designDummyChartOptions();
  }

  designDummyChartOptions() {
    this.dummychartOption = {
      animation: false,
      tooltip: { show: false },
      legend: { show: false },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },

      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false,
        data: Array.from({ length: 100 }, (_, i) => i),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },

      yAxis: {
        type: 'value',
        show: false,
        min: -1.5,
        max: 1.5,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }

      },
      lineStyle: {
        width: 4,
        cap: 'round',
        join: 'round'
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 3,
            color: '#F8F7F2'
          },
          data: Array.from({ length: 100 }, (_, i) =>
            Math.sin(i * 0.08 + Math.PI / 2),
          ),
        },
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 3,
            color: '#F00088'
          },
          data: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.08 - 0.8)),
        },
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 3,
            color: '#FF7A59'
          },
          data: Array.from(
            { length: 100 },
            (_, i) => 0.5 * Math.sin(i * 0.12 + 1) + 0.4 * Math.cos(i * 0.18),
          ),
        },
      ],
    };
  }

  designChartOptions() {
    this.categoryChartOption = {
      tooltip: {
        trigger: 'item',
      },

      series: [
        {
          name: 'Stocks',
          type: 'pie',
          radius: ['60%', '70%'],
          data: [
            { value: 1048, name: 'Reliance' },
            { value: 735, name: 'TCS' },
            { value: 580, name: 'Infosys' },
            { value: 484, name: 'HDFC Bank' },
            { value: 300, name: 'ICICI Bank' },
          ],
          padAngle: 4,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 10,
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.26)',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {d}%',
            color: '#000',
          },
        },
      ],
    };
  }
}
