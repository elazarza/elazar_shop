import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { ShopComponent } from './shop/shop.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CartComponent } from './shop/sections/cart/cart.component';
import { BrowseComponent } from './shop/sections/browse/browse.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FooterComponent } from './footer/footer.component';
import { ProductDialogComponent } from './shop/sections/browse/product-dialog/product-dialog.component';
import { SubmitDialogComponent } from './checkout/submit-dialog/submit-dialog.component';
import { AdminProductDialogComponent } from './admin/admin-product-dialog/admin-product-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  exports: [
    MaterialModule
  ],
  declarations: [
    AppComponent,
    SignupComponent,
    ShopComponent,
    CheckoutComponent,
    LoginComponent,
    CartComponent,
    BrowseComponent,
    AdminComponent,
    FooterComponent,
    ProductDialogComponent,
    SubmitDialogComponent,
    AdminProductDialogComponent
  ],
  entryComponents: [ProductDialogComponent, SubmitDialogComponent, AdminProductDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
