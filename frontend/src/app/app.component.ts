import {
  Component,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockContainerComponent } from './stock-container/stock-container.component';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StockContainerComponent, NavbarComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  
}
