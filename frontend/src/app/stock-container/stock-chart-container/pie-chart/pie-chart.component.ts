import { Component, OnInit } from '@angular/core';
import { StockSharedService } from '../../../shared/services/stocks/stockShared.service';
import { EChartsOption } from 'echarts';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit{

  pieChartOptions: EChartsOption = {}
  financialData: Record<string, number> = {};

  constructor(private sharedService: StockSharedService){}

  ngOnInit(): void {
    this.sharedService.selectedStockFinancialsEmitter.subscribe(
      (resp) => {
        this.financialData = resp
        this.initializePieChart();
      }
    )
  }

  initializePieChart(): void {
    const pieData = Object.entries(this.financialData).map(([name, value]) => ({
        name,
        value
    }));

    this.pieChartOptions = {
        backgroundColor: 'transparent',

        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                return `
                    <div>
                        <strong>${params.name}</strong><br/>
                        Value: ${this.formatNumber(params.value)}<br/>
                        ${params.percent}%
                    </div>
                `;
            }
        },

        legend: {
            bottom: 10,
            textStyle: {
                color: '#fff'
            }
        },

        series: [
            {
                name: 'Financials',
                type: 'pie',
                radius: ['45%', '75%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: true,

                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12
                },

                labelLine: {
                    show: true
                },

                emphasis: {
                    scale: true,
                    scaleSize: 10
                },

                data: pieData
            }
        ]
    };
}

formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN', {
        notation: 'compact',
        maximumFractionDigits: 2
    }).format(value);
}
}
