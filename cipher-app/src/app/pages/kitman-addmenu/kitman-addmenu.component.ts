import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-kitman-addmenu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kitman-addmenu.component.html',
  styleUrl: './kitman-addmenu.component.css'
})

export class KitmanAddmenuComponent {

  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  DayOfWeek: string = '';
  Meal:string='';
  Type:string='';
  Ingredients:string='';
  Comment:string='';
  Username:string='';
  isEditMode: boolean = false;

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<KitmanAddmenuComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
) {console.log('Received data in AddmachineComponent:', this.data);}

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

  console.log('Report Username:', this.reportusername);
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 
  
if (this.data) { 
  this.isEditMode = true;
  this.DayOfWeek = this.data.DayOfWeek || '';
  this.Meal = this.data.Meal || '';
  this.Type = this.data.Type || '';
  this.Ingredients = this.data.Ingredients || '';
  this.Comment = this.data.Comment || '';
}

}

  // Submit
  submitMenu(): void {
    if (!this.DayOfWeek || !this.Meal || !this.Type) {
      alert('Please select a Day and choose a Meal.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        DayOfWeek: this.DayOfWeek,
        Meal: this.Meal,
        Type: this.Type,
        Ingredients: this.Ingredients,
        Comment: this.Comment,
        Username: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_MenuPlanning]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Menu submitted successfully!');
         this.closeDialog();
        this.dialogRef.close('added');
       
      },
      error: (err) => {
        console.error('Error inserting Order', err);
        alert('Failed to submit Menu.');
      }
    });
  }

  UpdateMenu(): void {
    if (!this.DayOfWeek || !this.Meal || !this.Type) {
      alert('Please select a Day and choose a Meal.');
      return;
    }

    const payload = {
      JSONFileparams: JSON.stringify([{
        DayOfWeek: this.DayOfWeek,
        Meal: this.Meal,
        Type: this.Type,
        Ingredients: this.Ingredients,
        Comment: this.Comment,
        username: this.reportusername,
        ID: this.data?.ID,
      }]),
      spname: "[dbo].[sp_Update_MenuPlanning]"
    };

    console.log("Payload:", payload);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Menu submitted successfully!');
        this.closeDialog();
        this.dialogRef.close('updated');        
      },
      error: (err) => {
        console.error('Error inserting Order', err);
        alert('Failed to submit Menu.');
      }
    });
  }


  resetForm(): void {
      this.DayOfWeek ='',
      this.Meal ='',
      this.Type ='',
      this.Ingredients ='',
      this.Comment =''
  }

    closeDialog() {
    this.dialogRef.close();
  }

}

