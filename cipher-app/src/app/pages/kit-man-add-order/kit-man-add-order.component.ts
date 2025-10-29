import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface MealTypeOption {
  Meal: string;
}


@Component({
  selector: 'app-kit-man-add-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kit-man-add-order.component.html',
  styleUrl: './kit-man-add-order.component.css'
})
export class KitManAddOrderComponent {
  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  Meal: MealTypeOption[] = [];
  // selectedDriverId: number | string | null = null;

  MealType: string = '';
  MealDateTime:string='';
  Quantity: string='1';
  Status:string='';
  Remarks:string='';
  isEditMode: boolean = false;

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<KitManAddOrderComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
) {}

ngOnInit(): void {

  this.loadDrivers();

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
  
console.log('Dialog opened with data:', this.data); 
 
if (this.data) {
  this.isEditMode = true;
  this.MealType = this.data.MealType || '';
  this.MealDateTime = this.data.MealDateTime || '';
  this.Quantity = this.data.Quantity || '1';
  this.Status = this.data.Status || '';
  this.Remarks = this.data.Remarks || '';
}

}

loadDrivers(): void {
    const params = new HttpParams().set('spname', 'SELECT DISTINCT Meal FROM [dbo].[MenuPlanning]');

    this.http.get<any[]>(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC',
      { params }
    ).subscribe({
      next: (res) => {
        console.log('Meal API Response:', res);
        this.Meal = (res || [])
          .map(d => ({ Meal: d?.Meal ?? d?.meal ?? '' }))
          .filter(d => d.Meal);
      },
      error: (err) => console.error('Error loading Meal', err)    });
  }


  // Submit feedback
  submitFeedback(): void {
    if (!this.MealType || !this.MealDateTime) {
      alert('Please select a Meal Type and choose a Meal Date.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        MealType: this.MealType,
        MealDateTime: this.MealDateTime,
        Quantity: this.Quantity,
        Status:this.Status,
        Remarks: this.Remarks,
        UserName: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_MealOrders]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Order submitted successfully!');
        this.dialogRef.close('added');
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error inserting Order', err);
        alert('Failed to submit Order.');
      }
    });
  }

    UpdateOrder(): void {
    if (!this.MealType || !this.MealDateTime) {
      alert('Please select a Meal Type and choose a Meal Date.');
      return;
    }

    const payload = {
      JSONFileparams: JSON.stringify([{
        MealType: this.MealType,
        MealDateTime: this.MealDateTime,
        Quantity: this.Quantity,
        Status:this.Status,
        Remarks: this.Remarks,
        UserName: this.reportusername,
        ID: this.data?.ID,
      }]),
      spname: "[dbo].[sp_Update_MealOrders]"
    };

    console.log("Payload:", payload);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Order submitted successfully!');
        
        this.closeDialog();
        this.dialogRef.close('updated');
      },
      error: (err) => {
        console.error('Error inserting Order', err);
        alert('Failed to submit Order.');
      }
    });
  }

  resetForm(): void {
      this.MealType ='',
      this.MealDateTime ='',
      this.Quantity ='1',
      this.Status ='',
      this.Remarks ='',
      this.reportusername =''
  }

    closeDialog() {
    this.dialogRef.close();
  }

}
