import { Component, OnInit, Inject, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  product;
  url = this.commonService.BASE_URL + '/uploads/';
  quant = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private commonService: CommonService
  ) {
    this.product = data;
  }
  ngOnInit() {
  }
  editQuant(x) {
    if (x === '+') {
        this.quant++;
    } else if (x === '-') {
      if (this.quant > 1) {
        this.quant--;
      }
    }
  }
close() {
  this.dialogRef.close();
}
  add(prodid, quant) {
    this.dialogRef.close({prodid, quant});
  }
}
