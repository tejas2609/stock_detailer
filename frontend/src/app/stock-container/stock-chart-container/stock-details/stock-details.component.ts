import { Component, computed, input, Input, OnInit } from '@angular/core';
import { NgForOf } from "../../../../../node_modules/@angular/common/index";
import { SharedModule } from '../../../shared/shared.module';
import { StockSharedService } from '../../../shared/services/stocks/stockShared.service';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.scss'
})
export class StockDetailsComponent implements OnInit{
  // @Input('details') details: any;
  details = input<any>();
  detailsMap = computed(() => {
    return Object.fromEntries(
      this.details().map((item: any) => [item.key, item.value])
    );
  });
  loading = computed(() => !this.details())

  detailsObj = [
    {
      key: 'yearHigh',
      icon: 'trending_up',
      placeholder: 'Year High'
    },
    {
      key: 'yearLow',
      icon: 'trending_down',
      placeholder: 'Year Low'
    },
    {
      key: 'previousClose',
      icon: 'history',
      placeholder: 'Previous Close'
    },
    {
      key: 'dayHigh',
      icon: 'north',
      placeholder: 'Day High'
    },
    {
      key: 'dayLow',
      icon: 'south',
      placeholder: 'Day Low'
    }
  ];

  constructor(private stockSharedService: StockSharedService){}

  ngOnInit(){
  }

}
