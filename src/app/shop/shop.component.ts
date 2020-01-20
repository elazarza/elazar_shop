import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  opened$ = this.commonService.opened$;
  constructor(
    private commonService: CommonService,
    private router: Router
  ) { }

 cart = -1;
 cartItems = [];
 totalPrice = 0;

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message.isadmin) {
          this.router.navigate(['/admin']);
        }
      });

    this.commonService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message !== 'No results') {
          this.cart = res.message[0].id;
          this.getItemsForCart();
        }
      });
  }

  getItemsForCart() {
    this.commonService.getItemsForCart(this.cart)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message === 'No results') {
          this.cartItems = [];
          return;
        }
        this.cartItems = res.message;
        let total = 0;
        for (const i of res.message) {
          total += i.price * i.quant;
        }
        this.totalPrice = total;
      });
  }

  public toggleCart(e) {
   this.commonService.opened$.next(e);
  }

  public editQuant(data) {
    this.commonService.editQuant(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.getItemsForCart();
      });
  }

  public addItem(data) {
    for (const i of this.cartItems) {
      if (i.prodid === data.prodid) {
        const newQuant = i.quant + data.quant;
        this.editQuant({ id: i.id, quant: newQuant });
        this.getItemsForCart();
        return;
      }
    }
    if (this.cart === -1) {
      this.commonService.addCart()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.cart = res.res.insertId;
          this.commonService.addItemToCart({ ...data, cartid: res.res.insertId })
            .pipe(takeUntil(this.destroy$))
            .subscribe(resx => {
              this.getItemsForCart();
            });
        });
    } else {
      this.commonService.addItemToCart({ ...data, cartid: this.cart })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.getItemsForCart();
        });
    }
  }

  deleteAllItemsFromCart() {
    this.commonService.deleteAllItemsFromCart({ id: this.cart })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.commonService.deleteCart({ id: this.cart })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.cart = -1;
          this.totalPrice = 0;
          this.getItemsForCart();
        });
      });
  }

  deleteItem(data) {
    if (this.cartItems.length <= 1) {
      this.commonService.deleteCart({ id: this.cart })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.cart = -1;
          this.totalPrice = 0;
          this.getItemsForCart();
        });
    }
    this.commonService.deleteItem(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.getItemsForCart();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
