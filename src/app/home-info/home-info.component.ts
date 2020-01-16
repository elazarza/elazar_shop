import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '../common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-info',
  templateUrl: './home-info.component.html',
  styleUrls: ['./home-info.component.css']
})
export class HomeInfoComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();

  constructor(
    private commonService: CommonService
  ) { }

  totalProds = [];
  totalOrders = [];

  @Input() toHomeInfo;

  ngOnInit() {
    this.commonService.getTotalOrdersProds()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.totalOrders = res.message[1].prodtoal;
          this.totalProds = res.message[0].prodtoal;
          // const countp: string = res.message[0].prodtoal.toString();
          // const counto: string = res.message[1].prodtoal.toString();
          // for(let i=0; i<countp.length;i++){
          //   this.countProducts[i] = countp[i]
          // }
          // for(let j=0; j<counto.length;j++){
          //   this.countOrders[j] = counto[j]
          // }
        });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
