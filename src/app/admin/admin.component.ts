import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service'
import { FormBuilder, Validators } from '@angular/forms'
import { takeUntil, take } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AdminProductDialogComponent } from './admin-product-dialog/admin-product-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) { }

  img: any;
  categorys;
  showProds = false;
  products = [];
  term = '';
  form;
  current;
  txt = 'Hello Admin, please choose a category or start a search.';
  url = this.commonService.BASE_URL + '/uploads/';

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (!res.message.isadmin) {
         this.router.navigate(['/']);
        }
      });

    this.commonService.getCategorys()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categorys = res.message;
      });

    this.form = this.fb.group({
      prodname: this.fb.control(null, [Validators.required]),
      catid: this.fb.control(null, [Validators.required]),
      price: this.fb.control(null, [Validators.required]),
    });
  }

  public changeCategory(catid, catName) {
    this.showProds = !!catid;
    this.commonService.getProducts({ catid })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.txt = catName.toUpperCase();
      });
  }

  public search() {
    this.showProds = true;
    this.commonService.searchProduct(this.term)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.txt = 'Search results for: ' + this.term;
      });
  }


  openModal(product) {
    this.dialog.open(AdminProductDialogComponent, {
      data: product || '',
      width: '50%'
    }).afterClosed().pipe(take(1)).subscribe(res => {
      if (res) {
        if (res.what === 'modify') {
          this.modifyProduct(res.product);
        } else {
          this.addProduct(res.product);
        }
      }
    });
  }

  addProduct(product) {
    this.commonService.addProduct({ ...product, img: product.img })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.changeCategory(product.catid, 'Product successfully Added');
      });
  }

  modifyProduct(product) {
    this.commonService.editProd({ ...product, img: product.img, id: this.current })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.changeCategory(product.catid, 'Product successfully Modified');
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}