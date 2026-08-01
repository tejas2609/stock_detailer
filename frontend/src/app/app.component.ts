import {
  Component,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { StockSharedService } from './shared/services/stocks/stockShared.service';
import { StockListerComponent } from './stock-container/stock-lister/stock-lister.component';
import { AccountsComponent } from './accounts/accounts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SharedModule, StockListerComponent, AccountsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  isStockSelected : boolean = true
  changeView: boolean = false
  currentRoute: string = '';
  showStockLister: boolean = true;

  constructor(
    private sharedService: StockSharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedService.getAllStocks();

    this.sharedService.selectedStockEmitter.subscribe((res) => {
      this.isStockSelected = true
    });

    this.currentRoute = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.showStockLister = !this.currentRoute.includes('/dashboard');
      }
    });
  }

  changeViewStatus(status: any){
    this.sharedService.setStockGraphView()
  }

}
