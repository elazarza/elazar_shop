import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { SignupComponent } from './signup/signup.component';
import { OrderComponent } from './order/order.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
    {path:'shop', component:ShopComponent},
    {path:'signup', component:SignupComponent},
    {path:'order', component:OrderComponent},
    {path:'admin', component:AdminComponent},
    {path:'', component:HomeComponent},
    {path:'**', component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
