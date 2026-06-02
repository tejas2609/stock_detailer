import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockListerComponent } from './stock-lister.component';

describe('StockListerComponent', () => {
  let component: StockListerComponent;
  let fixture: ComponentFixture<StockListerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockListerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
