import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from './common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  username = 'Guest';

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.commonService.chkAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.username = res.message.fname + ' ' + res.message.lname;
        }
      });
    const height = window.innerHeight;
    const routerDiv = document.querySelector('.router') as HTMLElement;
    routerDiv.style.setProperty('height', height - 84 + 'px');
  }

  setUsername(name: any) {
    this.username = name;
  }

  logOut() {
    try {
      localStorage.removeItem('Token');
      sessionStorage.removeItem('Token');
    } catch { }

    window.location.href = '/';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
