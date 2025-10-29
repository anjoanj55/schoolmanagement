import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Service } from 'service';

@Component({
  selector: 'app-laun-man-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laun-man-feedback.component.html',
  styleUrl: './laun-man-feedback.component.css'
})
export class LaunManFeedbackComponent {

  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  rating: number = 0;
  hoverRating: number = 0;
  Service :string ='';
  comment: string = '';

    constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<LaunManFeedbackComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
) {}

ngOnInit(): void {
  let rawUserData: any = this.userDataService?.getUserData() || null;
  console.log('Raw userData for report:', rawUserData);

  if (typeof rawUserData === 'string') {
    try {
      rawUserData = JSON.parse(rawUserData);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      rawUserData = [];
    }
  }

  if (Array.isArray(rawUserData) && rawUserData.length > 0) {
    this.reportuserid = rawUserData[0]?.UserID || null;
    this.reportusername = (rawUserData[0]?.UserName || '').toLowerCase();
    this.reportrole = (rawUserData[0]?.RoleName || '').toLowerCase();
  }

  console.log('Report UserID:', this.reportuserid);
  console.log('Report Username:', this.reportusername);
  console.log('Report Role:', this.reportrole);
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 
  
}

// Load driver names from SP

  // Set selected rating
  setRating(value: number): void {
    this.rating = value;
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.Service || !this.rating) {
      alert('Please select a Service and choose a rating.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        Service: this.Service,
        Rating: this.rating,
        Comments: this.comment,
        Username: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_LaundryFeedback]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Feedback submitted successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error inserting feedback', err);
        alert('Failed to submit feedback.');
      }
    });
  }

  resetForm(): void {
this.Service = '',
this.rating = 0,
this.comment = '',
this.reportusername
 }

    closeDialog() {
    this.dialogRef.close();
  }

}

