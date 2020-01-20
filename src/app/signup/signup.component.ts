import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) { }

  step = 1;
  form1;
  form2;
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


  ngOnInit() {
    this.form1 = this.fb.group({
      id: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.email, Validators.required]),
      password: this.fb.control(null, [Validators.minLength(6), Validators.maxLength(12), Validators.required]),
      confirm: this.fb.control(null, [Validators.minLength(6), Validators.maxLength(12), Validators.required]),
    });

    this.form2 = this.fb.group({
      city: this.fb.control(null, [Validators.required]),
      street: this.fb.control(null, [Validators.required]),
      fname: this.fb.control(null, [Validators.required]),
      lname: this.fb.control(null, [Validators.required]),
    });
  }


  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public chkForm1(i, e, p, c) {
    if (!this.validateEmail(e)) {
      alert('E-mail address not valid.')
      return;
    }
    if (this.form1.get('password').value !== this.form1.get('confirm').value) {
      alert('Passwords do not match.')
      return;
    }
    if (p.length < 6 || p.length > 12) {
      alert('Please select a valid password (between 6-12 characters)')
      return;
    }
    if (!i || !e || !p || !c) {
      alert('Please fill all fields.')
      return;
    }
    this.commonService.verExistUser(this.form1.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.changeStep(this.form1.value);
        } else {
          alert(res.message);
        }
      });
  }

  public chkForm2(c, s, f, l) {
    if (!c || !s || !f || !l) {
      alert('Please fill all fields.')
      return;
    }
    this.signup(this.form2.value);
  }

  changeStep(data) {
    this.form1 = data;
    this.step = 2;
  }

  signup(data) {
    this.form2 = data;
    this.commonService.addUser({ ...this.form1, ...this.form2 })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.commonService.login({ email: this.form1.email, password: this.form1.password })
          .pipe(takeUntil(this.destroy$))
          .subscribe((resx: any) => {
            if (resx.state === 'success') {
              try {
                localStorage.removeItem('Token');
                sessionStorage.removeItem('Token');
              } catch { }
              sessionStorage.setItem('Token', resx.message.token);
              window.location.href = '/';
            } else {
              console.log('error');
            }
          });
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
