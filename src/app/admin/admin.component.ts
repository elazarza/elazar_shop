import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service'
import { FormBuilder, Validators } from '@angular/forms'
import { takeUntil } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder
  ) { }

  public categorys;
  public categoryProducts = 0;
  public products = [];
  public ifPopup = false;
  public term = '';
  public newProduct;
  public ifPopupAdd = false;
  public pathImgPopup = this.commonService.BASE_URL + '/imgs/add-photo.png';
  public imgToAdd = 'no-img.png';
  public currentProductId = -1;
  public ifDisplay = false;
  public ifModify = false;
  public messageHere = 'Chose category or do a search';
  public url = this.commonService.BASE_URL;

  ngOnInit() {

    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (!res.message.isadmin) {
          window.location.href = '/';
        } else {
          this.ifDisplay = true;
        }
      },
        err => window.location.href = '/'
      );

    this.commonService.getCategorys()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categorys = res.message;
      }, err => window.location.href = '/'
      );

    this.newProduct = this.fb.group({
      prodname: ['', [Validators.minLength(2), Validators.maxLength(40), Validators.required]],
      catid: [, Validators.required],
      price: [, Validators.required]
    });
  }

  public changeCategory(catid, catName) {
    this.categoryProducts = catid;
    this.commonService.getProducts({ catid })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.messageHere = catName;
      });
  }

  public search() {
    this.categoryProducts = 1
    this.commonService.searchProduct(this.term)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.products = res.message;
        this.messageHere = 'Results for: ' + this.term;
        this.term = '';
      });
  }

  public openPopupAdd(data = null) {
    if (data) {
      this.newProduct.controls['prodname'].setValue(data.prodname);
      this.newProduct.controls['catid'].setValue(data.catid);
      this.newProduct.controls['price'].setValue(data.price);
      this.pathImgPopup = this.commonService.BASE_URL + '/prodimages/' + data.img;
      this.imgToAdd = data.img;
      this.currentProductId = data.product_id;
      this.ifModify = true;
    }
    this.ifPopupAdd = true;
  }

  public closePopupAdd(event, pass = false) {
    if (pass || event.target.id === 'backgroundPopup') {
      this.ifPopupAdd = false;
      this.newProduct.reset();
      this.pathImgPopup = this.commonService.BASE_URL + '/imgs/add-photo.png';
      this.imgToAdd = 'no-img.png';
      this.currentProductId = -1;
      this.ifModify = false;
    }
  }

  public imgFile(e) {
    const data = new FormData();
    data.append('file', e.target.files[0])
    this.commonService.uploadImg(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.pathImgPopup = this.commonService.BASE_URL + `/prodimages/${res.filename}`;
        this.imgToAdd = res.filename;
      });
  }

  public addProduct() {
    if (!this.ifModify) {
      this.commonService.addProduct({ ...this.newProduct.value, img: this.imgToAdd })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.changeCategory(this.newProduct.value.catid, 'Product successfully Added')
          this.closePopupAdd('blah', true);
        });
    } else {
      this.commonService.editProd({ ...this.newProduct.value, img: this.imgToAdd, id: this.currentProductId })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.changeCategory(this.newProduct.value.catid, 'Product successfully Added');
          this.closePopupAdd('blah', true)
        });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}