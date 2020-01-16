import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service'
import { FormBuilder } from '@angular/forms'
import { Subject, pipe } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-shop-categorys',
  templateUrl: './shop-categorys.component.html',
  styleUrls: ['./shop-categorys.component.css']
})
export class ShopCategorysComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
  ) { }

  @Output() addItem = new EventEmitter();
  categorys;
  categoryProducts = 0;
  products = [];
  ifPopup = false;
  productPopup;
  quant = 1;
  term = '';
  messageHere = 'Choose category or search';
  url = this.commonService.BASE_URL;

  ngOnInit() {
    this.commonService.getCategorys()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categorys = res.message;
      }, err => window.location.href = '/'
      );
  }

  changeCategory(catid, catName) {
    this.categoryProducts = catid;
    this.commonService.getProducts({ catid })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.messageHere = 'category ' + catName;
      });
  }

  popupProduct(product) {
    this.productPopup = product;
    this.ifPopup = true;
  }

  closePopup(event) {
    if (event.target.id === 'backgroundPopup') {
      this.ifPopup = false;
      this.quant = 1;
    }
  }

  closePopupCross() {
    this.ifPopup = false;
    this.quant = 1;
  }

  editQuant(x) {
    if (x === '+') {
      if (this.quant < 20) {
        this.quant++;
      }
    } else if (x === '-') {
      if (this.quant > 1) {
        this.quant--;
      }
    }
  }

  search() {
    this.categoryProducts = 1;
    this.commonService.searchProduct(this.term)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
        this.products = res.message;
        this.messageHere = 'Results for: ' + this.term;
        this.term = '';
      });
  }

  addToCart(prodid) {
    this.addItem.emit({ prodid, quant: this.quant });
    this.ifPopup = false;
    this.quant = 1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
