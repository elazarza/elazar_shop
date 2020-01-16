import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common.service'
import { SignupComponent } from '../signup/signup.component'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup-step1',
  templateUrl: './signup-step1.component.html',
  styleUrls: ['./signup-step1.component.css']
})
export class SignupStep1Component implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private signupComponent: SignupComponent
  ) { }

  public dataStep1;
  public messageError = '';

  ngOnInit() {
    this.dataStep1 = this.fb.group({
      id: [, [Validators.min(100000000), Validators.max(1000000000), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.maxLength(12), Validators.required]],
      confirm: ['', [Validators.minLength(6), Validators.maxLength(12), Validators.required]]
    });
  }

  public submitStep1() {
    if (this.dataStep1.value.password !== this.dataStep1.value.confirm) {
      this.messageError = 'Passwords do not match';
      return;
    }
    this.commonService.verExistUser(this.dataStep1.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.state === 'success') {
          this.signupComponent.changeStep(2, this.dataStep1.value);
        } else {
          this.messageError = res.message;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
