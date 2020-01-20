import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient
  ) { }

  public BASE_URL = 'http://localhost:5000';
  public opened$ = new BehaviorSubject<boolean>(true);

  chkAuth() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/users/verToken', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public login(data) {
    return this.http.post(this.BASE_URL + '/api/users/login', data);
  }
  
  getCart() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/carts/getcart', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  getUser() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/users/getuser', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  getItemsForCart(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/getitemsforcart', { cartid: data }, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  editQuant(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.put(this.BASE_URL + '/api/carts/editquant', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

 

  public getTotalOrdersProds() {
    return this.http.get(this.BASE_URL + '/api/users/totalordprod')
  }

  public getCategorys() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/products/categorys', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public getProducts(catid) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/products/products', catid, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public verExistUser(data) {
    return this.http.post(this.BASE_URL + '/api/users/verExistUser', data);
  }

  public addUser(data) {
    return this.http.post(this.BASE_URL + '/api/users/adduser', data);
  }

  public addCart() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/carts/addcart', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public addItemToCart(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/additemtocart', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public deleteItem(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/deleteitemfromcart', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public deleteAllItemsFromCart(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/deleteallfromcart', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public deleteCart(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/deletecart', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public searchProduct(term) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/products/searchprods', { term }, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public uploadImg(data) {
    return this.http.post(this.BASE_URL + '/api/products/uploadimg', data);
  }

  public addProduct(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/products/addproduct', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public editProd(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/products/editprod', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }

  public addOrder(data) {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.post(this.BASE_URL + '/api/carts/addorder', data, {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }


  public getoccDates() {
    const authorization = localStorage.getItem('Token') || sessionStorage.getItem('Token');
    return this.http.get(this.BASE_URL + '/api/carts/occdates', {
      headers: { 'Content-Type': 'application/json', authorization }
    });
  }
}
