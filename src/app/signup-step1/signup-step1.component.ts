import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { shopService } from '../shop.services'
import { SignupComponent } from '../signup/signup.component'

@Component({
  selector: 'app-signup-step1',
  templateUrl: './signup-step1.component.html',
  styleUrls: ['./signup-step1.component.css']
})
export class SignupStep1Component implements OnInit {

  constructor(public fb : FormBuilder, public shopService : shopService,public signupComponent : SignupComponent) { }

  public dataStep1
  public messageError = ""

  ngOnInit() {
    this.dataStep1 = this.fb.group({
      user_id:[, [Validators.min(100000000),Validators.max(1000000000),Validators.required]],
      email:["",[Validators.email,Validators.required]],
      password:["",[Validators.minLength(6),Validators.maxLength(12),Validators.required]],
      confirm:["",[Validators.minLength(6),Validators.maxLength(12),Validators.required]]
    })
  }

  public submitStep1(){
    if(this.dataStep1.value.password != this.dataStep1.value.confirm){
      this.messageError = "Password confirm incorrect"
      return
    }
    this.shopService.verifyIdOrEmail(this.dataStep1.value).subscribe(
      (res:any)=>{
        if (res.state == 'success'){
          this.signupComponent.changeStep(2,this.dataStep1.value)
        }
        else{this.messageError=res.message}
      },err => console.log(err)
    )
  }

}
