import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockContainerComponent } from './stock-container/stock-container.component';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { StockSharedService } from './shared/services/stocks/stockShared.service';
import { GraphContainerComponent } from "./graph-container/graph-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StockContainerComponent, NavbarComponent, SharedModule, GraphContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  isStockSelected : boolean = true
  changeView: boolean = false

  constructor(private sharedService: StockSharedService) { }

  ngOnInit(): void {
    this.sharedService.getAllStocks();
    this.sharedService.selectedStockEmitter.subscribe((res) => {
      this.isStockSelected = true
    })
  }

  changeViewStatus(status: any){
    this.sharedService.setStockGraphView()
  }

}
