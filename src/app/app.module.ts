import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ShopComponent } from './shop/shop.component';
import { OrderComponent } from './order/order.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeLoginComponent } from './home-login/home-login.component';
import { HomeShopComponent } from './home-shop/home-shop.component';
import { HomeInfoComponent } from './home-info/home-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignupStep1Component } from './signup-step1/signup-step1.component';
import { SignupStep2Component } from './signup-step2/signup-step2.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { ShopCategorysComponent } from './shop-categorys/shop-categorys.component';
import { AdminComponent } from './admin/admin.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    ShopComponent,
    OrderComponent,
    NotfoundComponent,
    HomeLoginComponent,
    HomeShopComponent,
    HomeInfoComponent,
    SignupStep1Component,
    SignupStep2Component,
    ShopCartComponent,
    ShopCategorysComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
