import { Component, OnInit } from '@angular/core';
import {shopService} from '../shop.services'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public shopService:shopService) { }

  public step = 1
  public dataStep1
  public dataStep2

  ngOnInit() {
  }

  public changeStep(stp,data){
    this.dataStep1 = data
    this.step = stp;
    stp === 1?document.getElementById("titleStep2").classList.remove('titleStepOn'):document.getElementById("titleStep1").classList.remove('titleStepOn')
    document.getElementById("titleStep"+stp).classList.add('titleStepOn')
  }

  public submitSignup(data){
    this.dataStep2 = data
    this.shopService.signupNewUser({...this.dataStep1,...this.dataStep2}).subscribe(
      (res:any)=>{
        this.shopService.getlogin({mail:this.dataStep1.email,password:this.dataStep1.password}).subscribe(
          (resp: any) => {
            if (resp.state === "success") {
              if (localStorage.getItem('Token')) { localStorage.removeItem('Token') }
              if (sessionStorage.getItem('Token')) { sessionStorage.removeItem('Token') }
              sessionStorage.setItem('Token', resp.message.token)
              window.location.href = "/"
            }
            else {
              console.log("login error")
            }
          },erro => { console.log(erro) }
        )
      },err => console.log(err)
    )
  }

}
