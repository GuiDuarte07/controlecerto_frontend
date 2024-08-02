import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditCardDialogComponent } from './create-credit-card-dialog.component';

describe('CreateCreditCardDialogComponent', () => {
  let component: CreateCreditCardDialogComponent;
  let fixture: ComponentFixture<CreateCreditCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCreditCardDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCreditCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
