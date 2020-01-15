import { Component, OnInit } from '@angular/core';
import { shopService } from '../shop.services'
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public shopService: shopService, public fb: FormBuilder) { }

  public categorys
  public categoryProducts = 0
  public products = []
  public ifPopup = false;
  public theSearch = "";
  public newProduct;
  public ifPopupAdd = false
  public pathImgPopup = this.shopService.GlobalyPath+"/imgs/add-photo.png"
  public imgToAdd = "no-img.png"
  public currentProductId = -1
  public ifDisplay = false
  public ifModify = false
  public messageHere = "Chose category or do a search"
  public GlobalyPathInto = this.shopService.GlobalyPath;

  ngOnInit() {

    this.shopService.ifToken().subscribe(
      (res: any) => {
        if (!res.message.admin) {
          window.location.href = "/"
        }
        else { this.ifDisplay = true }
      },
      err => window.location.href = "/"
    )

    this.shopService.getcategorys().subscribe(
      (res: any) => {
        this.categorys = res.message
      }, err => window.location.href = "/"
    )

    this.newProduct = this.fb.group({
      product_name: ["", [Validators.minLength(2), Validators.maxLength(40), Validators.required]],
      category_id: [, Validators.required],
      price: [, Validators.required]
    })

  }

  public changeCategory(cat,catName) {
    this.categoryProducts = cat;
    this.shopService.getproducts({ category_id: cat }).subscribe(
      (res: any) => {
        this.products = res.message
        this.messageHere = catName
      }
    )
  }

  public search() {
    this.categoryProducts = 1
    this.shopService.searchProduct(this.theSearch).subscribe(
      (res: any) => {
        this.products = res.message
        this.messageHere = "Results for: "+this.theSearch
        this.theSearch = "";
      }
    )
  }

  public openPopupAdd(data = null) {
    if (data) {
      this.newProduct.controls['product_name'].setValue(data.product_name)
      this.newProduct.controls['category_id'].setValue(data.category_id)
      this.newProduct.controls['price'].setValue(data.price)
      this.pathImgPopup = this.shopService.GlobalyPath+"/products-imgs/" + data.img
      this.imgToAdd = data.img
      this.currentProductId = data.product_id
      this.ifModify = true
    }
    this.ifPopupAdd = true
  }

  public closePopupAdd(event, pass = false) {
    if (pass || event.target.id === "backgroundPopup") {
      this.ifPopupAdd = false
      this.newProduct.reset()
      this.pathImgPopup = this.shopService.GlobalyPath+"/imgs/add-photo.png"
      this.imgToAdd = "no-img.png"
      this.currentProductId = -1
      this.ifModify = false
    }
  }

  public imgFile(e) {
    let data = new FormData();
    data.append('file', e.target.files[0])
    this.shopService.uploadImg(data).subscribe(
      (res: any) => {
        this.pathImgPopup = this.shopService.GlobalyPath+`/products-imgs/${res.filename}`
        this.imgToAdd = res.filename
      },
      err => console.log(err)
    )
  }

  public addProduct() {
    if (!this.ifModify) {
      this.shopService.addProduct({ ...this.newProduct.value, img: this.imgToAdd }).subscribe(
        (res: any) => {
          this.changeCategory(this.newProduct.value.category_id,"Product successfully Added")
          this.closePopupAdd("blah", true)
        },
        err => console.log(err)
      )
    }
    else{
      this.shopService.modifyProduct({ ...this.newProduct.value, img: this.imgToAdd, product_id:this.currentProductId}).subscribe(
        (res: any) => {
          this.changeCategory(this.newProduct.value.category_id,"Product successfully Added")
          this.closePopupAdd("blah", true)
        },
        err => console.log(err)
      )
    }

  }

}