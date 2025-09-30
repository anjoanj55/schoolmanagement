import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-driver-information-action',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  templateUrl: './driver-information-action.component.html',
  styleUrl: './driver-information-action.component.css'
})
export class DriverInformationActionComponent implements OnInit {

  isLoading = true;
  error: string | null = null;

   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DriverInformationActionComponent>
  ) {}
   ngOnInit() {
    console.log('Dialog opened with data:', this.data); // ✅ Check what is received
  }
  closeDialog() {
    this.dialogRef.close();
  }
  

}
