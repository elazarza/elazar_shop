import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from './common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
window.onload = () => {
  document.getElementById('section-center').style.height = (window.innerHeight - 110) + "px";
}
window.onresize = () => {
  document.getElementById('section-center').style.height = (window.innerHeight - 110) + "px";
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  constructor(
    private commonService: CommonService
  ) { }

  username = 'Please Login';

  ngOnInit() {
    this.commonService.chkAuth().pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.username = res.message.fname + ' ' + res.message.lname;
        } else {
          console.log(res.message);
        }
      });
  }

  setName(name: any) {
    this.username = name;
  }

  logOut() {
    if (localStorage.getItem('Token')) {
      localStorage.removeItem('Token');
    }
    if (sessionStorage.getItem('Token')) {
      sessionStorage.removeItem('Token');
    }
    window.location.href = '/';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
