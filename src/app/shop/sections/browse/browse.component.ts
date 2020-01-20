import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonService } from '../../../common.service'
import { Subject, pipe } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,

  ) { }

  @Output() addItem = new EventEmitter();
  categorys;
  showProds = false;

  products = [];
  quant = 1;
  term = '';
  txt = 'Please choose a categorys or start a search.';
  url = this.commonService.BASE_URL + '/uploads/';

  ngOnInit() {
    this.commonService.getCategorys()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categorys = res.message;
      });
  }
  addToCart(prodid) {
    this.addItem.emit({ prodid, quant: this.quant });
    this.quant = 1;
  }

  selectCat(catid, catname) {
    this.showProds = !!catid;
    this.commonService.getProducts({ catid })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.txt = catname.toString().toUpperCase();
      });
  }

  openModal(product) {
    this.dialog.open(ProductDialogComponent, {
      data: product
    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (res) {
        this.quant = res.quant;
        this.addToCart(res.prodid);
      }
    });
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
    this.showProds = true;
    this.commonService.searchProduct(this.term)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.txt = 'Search results for: ' + this.term;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
