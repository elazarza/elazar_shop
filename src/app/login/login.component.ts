import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service'
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppComponent } from '../app.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private bar: AppComponent,
    private router: Router
  ) { }
  private readonly destroy$ = new Subject();

  totalProds = [];
  totalOrders = [];

  cartInfo;
  form;
  status = 'disconnected';
  error;

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.loginBtn(res.message.isadmin, res.message.fname + ' ' + res.message.lname);
        }
      });

    this.form = this.fb.group({
      email: this.fb.control(null, [Validators.email, Validators.required]),
      password: this.fb.control(null, [Validators.minLength(6), Validators.required]),
      remember: this.fb.control(true)
    });

    this.commonService.getTotalOrdersProds()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          const countp: string = res.message[0].prodtoal.toString();
          const counto: string = res.message[1].prodtoal.toString();
          for (let i = 0; i < countp.length; i++) {
            this.totalProds[i] = countp[i];
          }
          for (let j = 0; j < counto.length; j++) {
            this.totalOrders[j] = counto[j];
          }
        });
  }

  verifyLogin() {
    this.commonService.login(this.form.value).subscribe(
      (res: any) => {
        if (res.state === 'success') {
          try {
            localStorage.removeItem('Token');
            sessionStorage.removeItem('Token');
          } catch { }

          if (this.form.value.remember) {
            localStorage.setItem('Token', res.message.token);
          } else {
            sessionStorage.setItem('Token', res.message.token);
          }

          this.bar.setUsername(res.message.fname + ' ' + res.message.lname);
          this.loginBtn(res.message.isadmin, res.message.fname + ' ' + res.message.lname);
          this.error = '';
          this.form.reset();
        } else {
          this.error = res.message;
        }
      });
  }

  login() {
    if (this.status === 'new' || this.status === 'resume') {
      this.router.navigate(['/shop']);
    } else if (this.status === 'admin') {
      this.router.navigate(['/admin']);
    }
  }

  public loginBtn(admin, name) {
    if (admin) {
      this.status = 'admin';
      this.cartInfo = { message: '' };
      this.router.navigate(['/admin']);
    } else {
      this.commonService.getCart().subscribe(
        (res: any) => {
          if (res.message === 'No results') {
            this.status = 'new';
          } else {
            this.status = 'resume';
            this.cartInfo = { ...res, name };
          }
        });
    }
  }

}
