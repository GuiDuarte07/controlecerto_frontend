import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesDialogComponent } from './invoices-dialog.component';

describe('InvoicesDialogComponent', () => {
  let component: InvoicesDialogComponent;
  let fixture: ComponentFixture<InvoicesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
