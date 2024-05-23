import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncomeModalComponent } from './create-income-modal.component';

describe('CreateIncomeModalComponent', () => {
  let component: CreateIncomeModalComponent;
  let fixture: ComponentFixture<CreateIncomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIncomeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIncomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
