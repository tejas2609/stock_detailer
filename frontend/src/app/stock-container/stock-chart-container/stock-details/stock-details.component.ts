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
  loading = computed(() => !this.details())

  constructor(private stockSharedService: StockSharedService){}

  ngOnInit(){
  }
}
