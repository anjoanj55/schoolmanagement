import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


interface DriverOption {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-add-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.css']
})
export class AddFeedbackComponent implements OnInit {
  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  drivers: DriverOption[] = [];
  selectedDriverId: number | string | null = null;

  rating: number = 0;
  hoverRating: number = 0;
  comment: string = '';
  // username: string = 'Admin'; 

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<AddFeedbackComponent>,
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
  this.loadDrivers();
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 
  
}

// Load driver names from SP
  loadDrivers(): void {
    const params = new HttpParams().set('spname', '[dbo].[sp_Select_DriverInformation]');

    this.http.get<any[]>(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC',
      { params }
    ).subscribe({
      next: (res) => {
        console.log('Driver API Response:', res);
        this.drivers = (res || [])
          .map((d: any) => ({
            id: d?.DriverID ?? d?.Driver_ID ?? d?.driver_id ?? d?.id,
            name: d?.Name ?? `${d?.first_name ?? ''} ${d?.last_name ?? ''}`.trim()
          }))
          .filter(d => d.id && d.name);
      },
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  // Set selected rating
  setRating(value: number): void {
    this.rating = value;
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.selectedDriverId || !this.rating) {
      alert('Please select a driver and choose a rating.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        Username: this.reportusername,
        Rating: this.rating,
        Comment: this.comment,
        DriverID: this.selectedDriverId
      }]),
      spname: "[dbo].[sp_Insert_transport_feedback]"
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
    this.selectedDriverId = null;
    this.rating = 0;
    this.hoverRating = 0;
    this.comment = '';
  }

    closeDialog() {
    this.dialogRef.close();
  }

}
