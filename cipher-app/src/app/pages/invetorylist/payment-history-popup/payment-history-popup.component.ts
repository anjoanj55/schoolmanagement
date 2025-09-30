import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-history-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatDialogModule],
  templateUrl: './payment-history-popup.component.html',
  styleUrls: ['./payment-history-popup.component.css']
})
export class PaymentHistoryPopupComponent implements OnInit {

  showPaymentHistory = false;
  feehistory: any = [];

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any|null,
    public dialogRef: MatDialogRef<PaymentHistoryPopupComponent>
  ) {
    if (data && data.feehistory) {
      try {
        this.feehistory = data.feehistory;
        console.log('Dialog constructor parsed data:', this.feehistory);
      } catch (e) {
        console.error("❌ Failed to parse feehistory:", data.feehistory);
        this.feehistory = [];
      }
    } else {
      console.warn("⚠️ No data injected into dialog");
      this.feehistory = [];
    }
  }

  ngOnInit(): void {
    console.log("ngOnInit feehistory:", this.feehistory);
  }

 
}
