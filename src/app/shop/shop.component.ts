import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService
  ) { }

  public cart = -1;
  public arrItems = [];
  public totalPrice = 0;
  public ifDisplay = false;

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message.isadmin) {
          window.location.href = '/';
        } else {
          this.ifDisplay = true;
        }
      });

    this.commonService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message !== 'No results') {
          this.cart = res.message[0].cartid;
          this.takeItems();
        }
      });
  }

  takeItems() {
    this.commonService.getItemsForCart(this.cart)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message === 'No results') {
          this.arrItems = [];
          return;
        }
        this.arrItems = res.message;
        // let total = 0;
        for (const i of res.message) {
          this.totalPrice += i.price * i.quant;
        }
        // for (let i = 0; i < res.message.length; i++) {
        //   total += res.message[i].price * res.message[i].quant;
        // }
        // this.totalPrice = total;
      });
  }

  public resizeCart() {
    const cart = document.getElementById('cart');
    if (cart.offsetWidth > 0) {
      cart.style.minWidth = '0px'; cart.style.width = '0px';
    } else if (cart.offsetWidth <= 0) {
      cart.style.minWidth = "350px"; cart.style.width = '20%';
    }
  }

  public editQuant(data) {
    this.commonService.editQuant(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.takeItems();
      });
  }

  public addItem(data) {
    for (const i of this.arrItems) {
      if (this.arrItems[i].prodid === data.prodid) {
        const newQuant = this.arrItems[i].quant + data.quant;
        this.editQuant({ id: this.arrItems[i].id, quant: newQuant })
        this.takeItems();
        return;
      }
    }
    // for (let i = 0; i < this.arrItems.length; i++) {
    //   if (this.arrItems[i].prodid === data.prodid) {
    //     let newQuantity = this.arrItems[i].quant + data.quant;
    //     this.editQuant({ id: this.arrItems[i].id, quantity: newQuantity })
    //     this.takeItems()
    //     return;
    //   }
    // }
    if (this.cart === -1) {
      this.commonService.addCart()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.cart = res.res.insertId;
          this.commonService.addItemToCart({ ...data, cartid: res.res.insertId })
            .pipe(takeUntil(this.destroy$))
            .subscribe(resx => {
              this.takeItems();
            });
        });
    } else {
      this.commonService.addItemToCart({ ...data, cartid: this.cart })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.takeItems();
        });
    }
  }

  deleteItem(data) {
    if (this.arrItems.length <= 1) {
      this.commonService.deleteCart({ id: this.cart })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
          this.cart = -1;
          this.totalPrice = 0;
          this.takeItems();
        });
    }
    this.commonService.deleteItem(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
        this.takeItems();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
