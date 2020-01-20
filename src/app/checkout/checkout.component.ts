import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) { }
  public cart = -1;
  public cartItems = [];
  public cartArr = [];
  public totalPrice = 0;
  public form;
  public minDate;
  public user;
  public term = '';
  public occDates = [];
  public errorMsg = '';
  public url = this.commonService.BASE_URL + '/uploads/';
  cities = [
    { key: 'haifa', val: 'חיפה' },
    { key: 'jerusalem', val: 'ירושלים' },
    { key: 'telaviv', val: 'תל אביב' },
    { key: 'raanana', val: 'רעננה' },
    { key: 'tveria', val: 'טבריה' },
    { key: 'afula', val: 'עפולה' },
    { key: 'natanya', val: 'נתניה' },
    { key: 'ashqelon', val: 'אשקלון' },
    { key: 'beersheba', val: 'באר שבע' },
    { key: 'ashdod', val: 'אשדוד' },
  ];

  limit(e: any) {
    if (e.target.value.length === 17) {
      e.target.value = e.target.value.slice(0, 16);
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }
  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message.isadmin) {
          this.router.navigate(['/']);
        }
      });

    this.commonService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.message !== 'No results') {
          this.cart = res.message[0].id;
          this.getItemsForCart();
        } else {
          this.router.navigate(['/shop']);
        }
      });

    this.commonService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.user = res.message[0];
      });

    this.commonService.getoccDates()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.occDates = res.message;
      });

    this.form = this.fb.group({
      ordercity: this.fb.control(null, [Validators.required]),
      orderstreet: this.fb.control(null, [Validators.required]),
      senddate: this.fb.control(null, [Validators.required]),
      creditcard: this.fb.control(null, [Validators.required]),
    });

    this.minDate = new Date();

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
        this.cartArr = res.message;
        let total = 0;
        for (const i of res.message) {
          total += i.price * i.quant;
        }
        this.totalPrice = total;
      });
  }

  public autofill(e) {
    if (e === 'street') this.form.get('orderstreet').patchValue(this.user.street);
    if (e === 'city') this.form.get('ordercity').patchValue(this.user.city);
  }


  public submitOrder(c, s, d, cc) {
    if (!c || !s || !d || !cc || (cc && cc.toString().length < 16)) {
      alert('Please fill all fields');
      return;
    }
    const date = new Date();
    const now = date.toISOString().split('T')[0];
    this.commonService.addOrder({
      ...this.form.value, creditcard: this.form.get('creditcard').value.toString(),
      userid: this.user.id, cartid: this.cart, ordertotal: this.totalPrice.toFixed(2),
      products: this.cartItems, username: this.user.fname + ' ' + this.user.lname, now
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.dialog.open(SubmitDialogComponent, {
            data: res
          });
        } else {
          if (res.state === 'success') {
            this.dialog.open(SubmitDialogComponent, {
              data: { error: 'error' }
            });
          }
        }
      });
  }

  public search() {
    const arr = [];
    for (const i of this.cartItems) {
      if (i.prodname.toLowerCase().includes(this.term.toLowerCase())) {
        arr.push(i);
      }
    }
    this.cartArr = arr;
  }

  public chkDate() {
    const val = this.form.get('senddate').value;
    for (const i of this.occDates) {
      if (val.toISOString().split('T')[0] === i.senddate.split('T')[0]) {
        this.errorMsg = 'Date Occupied, please choose another date.';
        return;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
