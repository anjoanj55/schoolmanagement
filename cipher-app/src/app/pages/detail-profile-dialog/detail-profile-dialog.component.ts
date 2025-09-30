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
  'Roll Number'?: string;
  DOB?: string;
  Age: number;
  Gender: string;
  Class?: string;
  Section?: string;
  'Phone No.'?: string;
  Address?: string;
  Email?: string;
  'Admission Date'?: string;
  'Blood Group'?: string;
  State?: string;
  Nationality?: string;
 
  Department?: string;
  Subject?: string;
  'Joining Date'?: string;
  Role?: string;
}
 
@Component({
  selector: 'app-detail-profile-dialog',
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
  templateUrl: './detail-profile-dialog.component.html',
  styleUrls: ['./detail-profile-dialog.component.css']
})
export class DetailProfileDialogComponent implements OnInit {
 
  personDetail: PersonDetail | null = null;
  isLoading = true;
  error: string | null = null;
 
  constructor(
    public dialogRef: MatDialogRef<DetailProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; category: string },
    private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    // Call loadPersonDetail when the component is initialized
    console.log('Dialog data:', this.data);
    this.loadPersonDetail();
  }
 
  loadPersonDetail() {
  this.isLoading = true;   // Set loading state to true
  this.error = null;       // Reset any previous errors
 
  // Select the stored procedure based on the category
  let storedProcedure = '';
 
  if (this.data.category === 'Teacher') {
    storedProcedure = '[dbo].[sp_Select_DetailProfile_Teacher]';
  } else if (this.data.category === 'Staff') {
    storedProcedure = '[dbo].[sp_Select_DetailProfile_Staff]';
  } else if (this.data.category === 'Student') {
    storedProcedure = '[dbo].[sp_Select_DetailProfile_Student]';
  } else {
    this.error = 'Invalid category';
    this.isLoading = false;
    return;
  }
 
  // Build the parameter object for the selected stored procedure
  const selectspparam = {
    spname: storedProcedure,
    parameter1: this.data.category,
    spparameter1: '@category',      
    parameter2: this.data.id,      
    spparameter2: '@id'            
  };
 
  console.log('Request parameters:', selectspparam);
 
  // Make POST request to the backend API
  this.http.post<PersonDetail[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams", selectspparam, { responseType: 'json' })
    .subscribe({
      next: (response: any) => {
        console.log('Person detail response:', response);
       
        if (response && response.length > 0) {
          this.personDetail = response[0];  // Assuming the SP returns an array with one record
        } else {
          this.error = 'No details found for this person';
        }
        this.isLoading = false;  // Stop loading
      },
      error: (err) => {
        console.error('Error loading person details:', err);
        this.error = 'Failed to load person details. Please try again.';
        this.isLoading = false;  // Stop loading in case of error
      }
    });
}
 

 
  onClose(): void {
    this.dialogRef.close();
  }
 
  onRefresh(): void {
    this.loadPersonDetail();
  }
 
  // Helper method to format date
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