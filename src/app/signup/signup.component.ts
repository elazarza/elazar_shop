import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService
  ) { }

  step = 1;
  dataStep1;
  dataStep2;


   changeStep(stp, data) {
    this.dataStep1 = data;
    this.step = stp;
    stp === 1 ?
      document.getElementById('titleStep2').classList.remove('titleStepOn') :
      document.getElementById('titleStep1').classList.remove('titleStepOn');
    document.getElementById('titleStep' + stp).classList.add('titleStepOn');
  }

   submitSignup(data) {
    this.dataStep2 = data;
    this.commonService.addUser({ ...this.dataStep1, ...this.dataStep2 })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.commonService.login({ email: this.dataStep1.email, password: this.dataStep1.password })
          .pipe(takeUntil(this.destroy$))
          .subscribe((resx: any) => {
            if (resx.state === 'success') {
              if (localStorage.getItem('Token')) { localStorage.removeItem('Token'); }
              if (sessionStorage.getItem('Token')) { sessionStorage.removeItem('Token'); }
              sessionStorage.setItem('Token', resx.message.token);
              window.location.href = '/';
            } else {
              console.log('Login error');
            }
          });
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
