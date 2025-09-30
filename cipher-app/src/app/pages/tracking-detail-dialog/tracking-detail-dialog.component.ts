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

interface PersonDetail {
  Photo?: string;
  'First Name': string;
  'Last Name': string;
  Age: number;
  Gender: string;
  'Person Found DateTime': string;
  'Location Name': string;
  'Zone Name': string;
  'Camera Name': string;
  'Person Found Emotion': string;
  Role?: string;
}

@Component({
  selector: 'app-tracking-profile-dialog',
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
  templateUrl: './tracking-detail-dialog.component.html',
  styleUrls: ['./tracking-detail-dialog.component.css']
})
export class TrackingDetailDialogComponent implements OnInit {

  // ADD BOTH PROPERTIES
  personDetails: PersonDetail[] = []; // Array for table display
  personDetail: PersonDetail | null = null; // Single object for individual profile display
  isLoading = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TrackingDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; category: string },
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('Dialog data:', this.data);
    this.loadPersonDetail();
  }

  loadPersonDetail() {
    this.isLoading = true;
    this.error = null;

    let storedProcedure = 'dbo.sp_Select_TrackingDetails';

    const selectspparam = {
      spname: storedProcedure,
      parameter1: this.data.category,
      spparameter1: '@category',
      parameter2: this.data.id,
      spparameter2: '@id'
    };

    console.log('Request parameters:', selectspparam);

    this.http.post<PersonDetail[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams", selectspparam, { responseType: 'json' })
    .subscribe({
      next: (response: any) => {
        console.log('Person detail response:', response);

        if (response && response.length > 0) {
          // ASSIGN BOTH PROPERTIES
          this.personDetails = response; // Entire array for table
          this.personDetail = response[0]; // First record for profile display
        } else {
          this.error = 'No details found for this person';
          this.personDetails = [];
          this.personDetail = null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading person details:', err);
        this.error = 'Failed to load person details. Please try again.';
        this.personDetails = [];
        this.personDetail = null;
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onRefresh(): void {
    this.loadPersonDetail();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not Available';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
