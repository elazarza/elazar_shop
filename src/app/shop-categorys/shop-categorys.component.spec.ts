import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCategorysComponent } from './shop-categorys.component';

describe('ShopCategorysComponent', () => {
  let component: ShopCategorysComponent;
  let fixture: ComponentFixture<ShopCategorysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopCategorysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopCategorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
