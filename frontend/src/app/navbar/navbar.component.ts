import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output()
  viewChange = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  navigate(route: string): void{
    this.router.navigate([route]);
  }
}
