import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service'
import { FormBuilder, Validators } from '@angular/forms'
import { AppComponent } from '../app.component'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.css']
})
export class HomeLoginComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    public bar: AppComponent
  ) { }
  private readonly destroy$ = new Subject();

  public dataLogin;
  public stateUserShop = 'disconnect';
  public buttonShop = 'connection require to start shopping';
  public classBtn = 'notConnectedBtn';
  public displayError = '';
  @Output() funcInfo = new EventEmitter();

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.displayBtn(res.message.isadmin, res.message.fname + ' ' + res.message.lname);
        } else {
          console.log(res.message);
        }
      });

    this.dataLogin = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      keepme: ['true']
    });
  }

  verifyLogin() {
    this.commonService.login(this.dataLogin.value).subscribe(
      (res: any) => {
        if (res.state === 'success') {
          if (localStorage.getItem('Token')) {
            localStorage.removeItem('Token');
          }
          if (sessionStorage.getItem('Token')) {
            sessionStorage.removeItem('Token');
          }
          if (this.dataLogin.value.keepme) {
            localStorage.setItem('Token', res.message.token);
          } else {
            sessionStorage.setItem('Token', res.message.token);
          }
          this.bar.setName(res.message.fname + ' ' + res.message.lname);
          this.displayBtn(res.message.isadmin, res.message.fname + ' ' + res.message.lname);
          this.displayError = '';
          this.dataLogin.reset();
        } else {
          console.log('Login error')
          this.displayError = res.message;
        }
      });
  }

  login() {
    if (this.stateUserShop === 'connectStart' || this.stateUserShop === 'connectResume') {
      window.location.href = '/shop';
    } else if (this.stateUserShop === 'connectAdmin') {
      window.location.href = '/admin';
    } else {
      document.getElementById('btnShop').style.color = '#ff4639';
      setTimeout(() => {
        document.getElementById('btnShop').style.color = 'white';
      }, 1000);
    }
  }

  public displayBtn(admin, name) {
    if (admin) {
      this.stateUserShop = 'connectAdmin';
      this.buttonShop = 'Administrator Page';
      this.classBtn = 'connectedBtn';
      this.funcInfo.emit({ message: '' });
      window.location.href = '/admin';
    } else {
      this.commonService.getCart().subscribe(
        (res: any) => {
          if (res.message === 'No results') {
            this.stateUserShop = 'connectStart';
            this.buttonShop = 'Start Shopping';
            this.classBtn = 'connectedBtn';
          } else {
            this.stateUserShop = 'connectResume';
            this.buttonShop = 'Resume Shopping';
            this.classBtn = 'connectedBtn';
          }
          this.funcInfo.emit({ ...res, name });
        });
    }
  }

}
