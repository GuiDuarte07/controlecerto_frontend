import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTansactionsTypesComponent } from './create-tansactions-types.component';

describe('CreateTansactionsTypesComponent', () => {
  let component: CreateTansactionsTypesComponent;
  let fixture: ComponentFixture<CreateTansactionsTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTansactionsTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTansactionsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
