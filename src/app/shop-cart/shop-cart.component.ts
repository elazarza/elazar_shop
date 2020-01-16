import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../common.service'

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css']
})
export class ShopCartComponent {

  constructor(public commonService: CommonService) { }
  @Input() cart: number;
  @Input() arrItems;
  @Input() totalPrice;
  @Output() chQuantity = new EventEmitter();
  @Output() delItem = new EventEmitter();
  cartId = -1;
  url = this.commonService.BASE_URL;
 editQuant(e, id) {
    this.chQuantity.emit({ id, quant: e.target.value })
  }

 deleteItem(data) {
    this.delItem.emit({ id: data });
  }

 deleteAll() {
    let i = this.arrItems.length;
    const delInterval = setInterval(() => {
      if (i === 0) {
        clearInterval(delInterval);
        return;
      }
      this.deleteItem(this.arrItems[i - 1].id);
      i--;
    }, 300);
  }
}