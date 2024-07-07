import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentDialogComponent } from './invoice-payment-dialog.component';

describe('InvoicePaymentDialogComponent', () => {
  let component: InvoicePaymentDialogComponent;
  let fixture: ComponentFixture<InvoicePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePaymentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
