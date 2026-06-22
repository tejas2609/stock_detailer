import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

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

  emitEvent(){
    this.viewChange.emit(true);
  }
}
