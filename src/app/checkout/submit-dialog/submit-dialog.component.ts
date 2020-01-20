import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent implements OnInit {
  public url = this.commonService.BASE_URL;
pdf;
  constructor(
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SubmitDialogComponent>,
  ) {
    this.pdf = data.pdf;
  }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
}
