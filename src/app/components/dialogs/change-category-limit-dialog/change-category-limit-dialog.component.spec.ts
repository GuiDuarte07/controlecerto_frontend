import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCategoryLimitDialogComponent } from './change-category-limit-dialog.component';

describe('ChangeCategoryLimitDialogComponent', () => {
  let component: ChangeCategoryLimitDialogComponent;
  let fixture: ComponentFixture<ChangeCategoryLimitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeCategoryLimitDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeCategoryLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
