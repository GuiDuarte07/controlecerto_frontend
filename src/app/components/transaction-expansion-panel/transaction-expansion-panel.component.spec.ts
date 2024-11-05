import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionExpansionPanelComponent } from './transaction-expansion-panel.component';

describe('TransactionExpansionPanelComponent', () => {
  let component: TransactionExpansionPanelComponent;
  let fixture: ComponentFixture<TransactionExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionExpansionPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
