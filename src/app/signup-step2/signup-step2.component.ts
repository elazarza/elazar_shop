import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, Validator } from '@angular/forms'
import { SignupComponent } from '../signup/signup.component'

@Component({
  selector: 'app-signup-step2',
  templateUrl: './signup-step2.component.html',
  styleUrls: ['./signup-step2.component.css']
})
export class SignupStep2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private signupComponent: SignupComponent
  ) { }

  public dataStep2;

  ngOnInit() {
    this.dataStep2 = this.fb.group({
      city: ['', Validators.required],
      street: ['', [Validators.minLength(2), Validators.maxLength(20), Validators.required]],
      fname: ['', [Validators.minLength(2), Validators.maxLength(20), Validators.required]],
      lname: ['', [Validators.minLength(2), Validators.maxLength(20), Validators.required]]
    });
  }
  public submitStep2() {
    this.signupComponent.submitSignup(this.dataStep2.value)
  }

}
