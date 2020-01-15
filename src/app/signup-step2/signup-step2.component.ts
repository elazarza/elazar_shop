import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, Validator } from '@angular/forms'
import { SignupComponent } from '../signup/signup.component'

@Component({
  selector: 'app-signup-step2',
  templateUrl: './signup-step2.component.html',
  styleUrls: ['./signup-step2.component.css']
})
export class SignupStep2Component implements OnInit {

  constructor( public fb : FormBuilder, public signupComponent : SignupComponent) { }

  public dataStep2

  ngOnInit() {
    this.dataStep2 = this.fb.group({
      city:["",Validators.required],
      adress:["",[Validators.minLength(2),Validators.maxLength(20),Validators.required]],
      first_name:["",[Validators.minLength(2),Validators.maxLength(20),Validators.required]],
      last_name:["",[Validators.minLength(2),Validators.maxLength(20),Validators.required]]
    })
  }
  public submitStep2(){
    this.signupComponent.submitSignup(this.dataStep2.value)
  }

}
