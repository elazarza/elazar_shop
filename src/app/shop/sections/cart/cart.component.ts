import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  opened$ = this.commonService.opened$;
  constructor(
    private commonService: CommonService
  ) { }

  @Output() editQuantClicked = new EventEmitter();
  @Output() delItem = new EventEmitter();
  @Output() delAll = new EventEmitter();
  @Output() addItem = new EventEmitter();

  @Input() cartItems;
  @Input() cart: number;
  @Input() totalPrice;

  url = this.commonService.BASE_URL + '/uploads/';

  editQuant(e, id) {
    this.editQuantClicked.emit({ id, quant: e.target.value });
  }

  deleteItem(id) {
    this.delItem.emit({ id });
  }

  deleteAll() {
    this.delAll.emit();
  }
  addItemEmit(e) {
    this.addItem.emit(e);
  }
}