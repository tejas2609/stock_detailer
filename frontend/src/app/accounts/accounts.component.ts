import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  selectedAccount: string = 'Select Account';
  openDropdown: boolean = false;

  toggleDropdown() {
    this.openDropdown = !this.openDropdown;
  }
}
