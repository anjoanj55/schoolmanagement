import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface MealOption {
  ID: number | string;
  Meal: string;
}

@Component({
  selector: 'app-meal-ord-add-fdbck',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-ord-add-fdbck.component.html',
  styleUrl: './meal-ord-add-fdbck.component.css'
})
export class MealOrdAddFdbckComponent implements OnInit {
  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  Meal: MealOption[] = [];
  selectedMealID: number | string | null = null;

  rating: number = 0;
  hoverRating: number = 0;
  comment: string = '';
  suggestions: string = '';
  // username: string = 'Admin'; 

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<MealOrdAddFdbckComponent>,
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
  this.loadMeal();
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 
  
}

// Load driver names from SP
  loadMeal(): void {
    const params = new HttpParams().set('spname', "select ID,concat(DayOfWeek,'-',Meal,'-',Ingredients) as Meal from MenuPlanning");

    this.http.get<any[]>(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC',
      { params }
    ).subscribe({
      next: (res) => {
        console.log('Meal API Response:', res);
        this.Meal = (res || [])
          .map((d: any) => ({
            ID: d?.ID ?? d?.ID ?? d?.ID ?? d?.ID,
            Meal: d?.Meal ?? d?.Meal ?? d?.Meal ?? d?.Meal
          }))
          .filter(d => d.ID && d.Meal);
      },
      error: (err) => console.error('Error loading Meal', err)
    });
  }

  // Set selected rating
  setRating(value: number): void {
    this.rating = value;
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.selectedMealID || !this.rating) {
      alert('Please select a driver and choose a rating.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        MenuID: this.selectedMealID,
        Rating: this.rating,
        Comments: this.comment,
        Suggestions:this.suggestions,
        SubmittedBy: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_MealFeedback]"
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
this.selectedMealID = null,
this.rating = 0,
this.comment = '',
this.suggestions = '',
this.reportusername
 }

    closeDialog() {
    this.dialogRef.close();
  }

}
