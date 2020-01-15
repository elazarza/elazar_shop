import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { shopService } from '../shop.services'
import { FormBuilder, Validators } from '@angular/forms'
import { AppComponent } from '../app.component'

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.css']
})
export class HomeLoginComponent implements OnInit {

  constructor(public shopService: shopService, public fb: FormBuilder, public ac: AppComponent) { }

  public dataLogin;
  public stateUserShop = 'disconnect'
  public buttonShop = 'connection require to start shopping'
  public classBtn = 'notConnectedBtn'
  public displayError = ""
  @Output() funcInfo = new EventEmitter();

  ngOnInit() {
    this.shopService.ifToken().subscribe(
      (res: any) => {
        if (res.state == "success") {
          this.displayBtn(res.message.admin,res.message.first_name+" "+res.message.last_name)
        }
        else { console.log(res.message) }
      },
      err => {  }
    )

    this.dataLogin = this.fb.group({
      mail: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(6), Validators.required]],
      keepme: ["true"]
    })
  }

  public verifyLogin() {
    console.log(this.dataLogin.value)
    this.shopService.getlogin(this.dataLogin.value).subscribe(
      (res: any) => {
        if (res.state === "success") {
          if (localStorage.getItem('Token')) { localStorage.removeItem('Token') }
          if (sessionStorage.getItem('Token')) { sessionStorage.removeItem('Token') }
          console.log("barouh aba")
          if (this.dataLogin.value.keepme) { localStorage.setItem('Token', res.message.token) }
          else { sessionStorage.setItem('Token', res.message.token) }
          this.ac.ifLogin(res.message.first_name + " " + res.message.last_name)
          this.displayBtn(res.message.admin,res.message.first_name+" "+res.message.last_name)
          this.displayError = ""
          this.dataLogin.reset()
        }
        else {
          console.log("login Error")
          this.displayError = res.message
        }
      },
      err => { console.log(err) }
    )
  }

  public goToShop() {
    if (this.stateUserShop == 'connectStart'||this.stateUserShop == 'connectResume') { window.location.href = "/shop" }
    else if(this.stateUserShop == "connectAdmin"){ window.location.href = "/admin" }
    else {
      document.getElementById('btnShop').style.color = '#ff4639';
      setTimeout(() => { document.getElementById('btnShop').style.color = 'white' }, 1000)
    }
  }

  public displayBtn(admin,name){
    if (admin) {
      this.stateUserShop = 'connectAdmin';
      this.buttonShop = 'Administrator Page';
      this.classBtn = 'connectedBtn'
      this.funcInfo.emit({message:""})
      window.location.href="/admin"
    }
    else {
      this.shopService.getCart().subscribe(
        (res: any) => {
          if (res.message === "No results cart") {
            this.stateUserShop = 'connectStart';
            this.buttonShop = 'Start Shopping';
            this.classBtn = 'connectedBtn'
          }
          else {
            this.stateUserShop = 'connectResume';
            this.buttonShop = 'Resume Shopping';
            this.classBtn = 'connectedBtn'
          }
          this.funcInfo.emit({...res,name})
        }
      )
    }
  }

}
