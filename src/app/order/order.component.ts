import { Component, OnInit } from '@angular/core';
import { shopService } from '../shop.services';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(public shopService:shopService, public fb:FormBuilder) { }
  public ifDisplay = false;
  public cart = -1;
  public arrItems = [];
  public arrList = []
  public totalPrice = 0;
  public dataOrder;
  public minDate;
  public maxDate;
  public user;
  public ifPopup = false;
  public ifPopupError = false;
  public pathPdf = "";
  public btnOrder = "Order"
  public theSearch = ""
  public datesProhibited = []
  public validDate = false
  public errorDate = ""
  public GlobalyPathInto = this.shopService.GlobalyPath;

  ngOnInit() {
    this.shopService.ifToken().subscribe(
      (res:any)=>{
        if(res.message.admin){
          window.location.href = "/"
        }
        else{this.ifDisplay=true}
      },
      err=>window.location.href = "/"
    )

    this.shopService.getCart().subscribe(
      (res: any) => {
        if (res.message !== 'No results cart') {
          this.cart = res.message[0].cart_id;
          this.takeItems()
        }
        else{
          window.location.href = "/shop"
        }
      },
      err => { window.location.href="/shop" }
    )

    this.shopService.getUser().subscribe(
      (res:any)=>{
        this.user = res.message[0];
      },err => console.log(err)
    )

    this.shopService.dates3().subscribe(
      (res:any)=>{
        this.datesProhibited = res.message
      },err =>{console.log(err)}
    )

    this.dataOrder= this.fb.group({
      received_city:[,Validators.required],
      received_adress:["",[Validators.minLength(2),Validators.maxLength(20),Validators.required]],
      received_date:["",Validators.required],
      payment_number:["",[Validators.pattern('[0-9]{16}'),Validators.required]]
    })

    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 2);
    this.minDate = myDate.toISOString().split("T")[0];
    let myMaxDate = new Date()
    myMaxDate.setDate(myMaxDate.getDate()+90+this.datesProhibited.length);
    this.maxDate = myMaxDate.toISOString().split("T")[0];
  }

  takeItems() {
    this.shopService.getItems(this.cart).subscribe(
      (res: any) => {
        if(res.message === "No results!!!"){this.arrItems = []; return}
        this.arrItems = res.message
        this.arrList = res.message
        let total = 0
        for(let i = 0 ; i<res.message.length; i++){
          total += res.message[i].price * res.message[i].quantity
        }
        this.totalPrice = total;
      },
      err => console.log(err)
    )
  }

  public automaticCity(){
    this.dataOrder.controls['received_city'].setValue(this.user.city.toLowerCase())
  }

  public automaticAdress(){
    this.dataOrder.controls['received_adress'].setValue(this.user.adress)
  }

  public submitOrder(){
    this.btnOrder = "one moment ..."
    let datenow = new Date();
    let thedatenow = datenow.toISOString().split("T")[0];
    this.shopService.addOrder({...this.dataOrder.value,user_id:this.user.t_z,cart_id:this.cart,total_price:this.totalPrice.toFixed(2),products:this.arrItems,user_name:this.user.first_name+" "+this.user.last_name,datenow:thedatenow}).subscribe(
      (res:any)=>{
        if(res.state = "success"){
          this.ifPopup=true;
          this.pathPdf = res.receiptPdf
        }
        else{this.ifPopupError = true;}
      },
      err => {
        console.log(err)
        this.ifPopupError = true;
      }
    )
  }

  public searchCart(){
    if(this.theSearch === ""){
      this.arrList = this.arrItems;
      return
    }
    let newArr = []
    for(let i=0;i<this.arrItems.length;i++){
      if(this.arrItems[i].product_name.toLowerCase().startsWith(this.theSearch.toLowerCase(),0)){
        newArr.push(this.arrItems[i])
      }
    }
    this.arrList = newArr
  }

  public inputDate(){
    let theDate = this.dataOrder.value.received_date
    if(theDate>=this.minDate && theDate<=this.maxDate){
      for(let i=0; i<this.datesProhibited.length;i++){
        if(theDate === this.datesProhibited[i].received_date.split("T")[0]){
          this.validDate = false;
          this.errorDate = "sorry no deliverers available, chose another date"
          return
        }
      }
      this.errorDate = ""
      this.validDate = true
    }
    else{
      this.errorDate = "chose date between "+this.minDate+" and "+this.maxDate
      this.validDate = false
    }
  }
  
}
