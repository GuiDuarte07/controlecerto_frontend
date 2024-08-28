import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditcardDetailsComponent } from './creditcard-details.component';

describe('CreditcardDetailsComponent', () => {
  let component: CreditcardDetailsComponent;
  let fixture: ComponentFixture<CreditcardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditcardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditcardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
