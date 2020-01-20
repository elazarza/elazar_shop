import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/common.service';
import { Validators, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-product-dialog',
  templateUrl: './admin-product-dialog.component.html',
  styleUrls: ['./admin-product-dialog.component.css']
})
export class AdminProductDialogComponent implements OnInit {
  categorys;
  product;
  form;
  what;
  img;
  url = this.commonService.BASE_URL + '/uploads/';
  private readonly destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AdminProductDialogComponent>,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.product = data;
    if (data) this.img = data.img;
    this.commonService.getCategorys()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.categorys = res.message;
      }
      );
  }

  ngOnInit() {
    this.form = this.fb.group({
      prodname: this.fb.control(null, [Validators.required]),
      catid: this.fb.control(null, [Validators.required]),
      price: this.fb.control(null, [Validators.required]),
    });
    if (this.product) {
      this.what = 'modify';
      this.form.patchValue({ ...this.product });
      this.img = this.product.img;
    } else {
      this.what = 'add';
    }
  }
  public uploadImg(e) {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    this.commonService.uploadImg(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.img = res.filename;
      });
  }

  close() {
    this.dialogRef.close();
  }
  closeModal() {
    const prodname = this.form.get('prodname').value;
    const catid = this.form.get('catid').value;
    const price = this.form.get('price').value;
    if (!prodname || !catid || !price) {
      alert('Please fill all fields');
      return;
    }

    this.dialogRef.close({ product: { prodname, catid, price, img: this.img }, what: this.what });
  }
}
