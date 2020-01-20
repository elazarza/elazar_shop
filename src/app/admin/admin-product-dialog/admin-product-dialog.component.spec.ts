import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductDialogComponent } from './admin-product-dialog.component';

describe('AdminProductDialogComponent', () => {
  let component: AdminProductDialogComponent;
  let fixture: ComponentFixture<AdminProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
