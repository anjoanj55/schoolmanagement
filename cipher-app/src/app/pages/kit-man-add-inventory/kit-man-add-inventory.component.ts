import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-kit-man-add-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kit-man-add-inventory.component.html',
  styleUrl: './kit-man-add-inventory.component.css'
})
export class KitManAddInventoryComponent  {
  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  // rating: number = 0;
  // hoverRating: number = 0;
  // comment: string = '';
  // suggestions: string = '';
  // username: string = 'Admin'; 
ItemName: string = '';
Category: string = '';
Quantity: string = '';
Status: string = '';
Unit: string = '';
ReorderLevel: string = '';
Supplier: string = '';
PurchaseDate : string = '';
ExpiryDate: string = '';
InsertedBy: string = '';
isEditMode: boolean = false;


  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<KitManAddInventoryComponent>,
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

  console.log('Report Username:', this.reportusername);
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 

if (this.data) {
  this.isEditMode = true;
  this.ItemName = this.data.ItemName || '';
  this.Category = this.data.Category || '';
  this.Quantity = this.data.Quantity || '';
  this.Status = this.data.Status || '';
  this.Unit = this.data.Unit || '';
  this.ReorderLevel = this.data.ReorderLevel || '';
  this.Supplier = this.data.Supplier || '';
}
  
}


  // Set selected rating

  // Submit feedback
  submitFeedback(): void {
    if (!this.ItemName) {
      alert('Please Fill All Required Fields');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        // Username: this.reportusername,
        // Rating: this.rating,
        // Comment: this.comment,
        ItemName: this.ItemName,
        Category: this.Category,
        Quantity: this.Quantity,
        Status: this.Status,
        Unit:this.Unit,
        ReorderLevel:this.ReorderLevel,
        Supplier: this.Supplier,
        InsertedBy: this.reportusername

      }]),
      spname: "[dbo].[sp_Insert_KitchenInventory]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Inventory submitted successfully!');
        this.closeDialog();
        this.dialogRef.close('added');
      },
      error: (err) => {
        console.error('Error inserting Inventory', err);
        alert('Failed to submit Inventory.');
      }
    });
  }

    UpdateInven(): void {
    if (!this.ItemName) {
      alert('Please Fill All Required Fields');
      return;
    }

    const Payload = {
      JSONFileparams: JSON.stringify([{
        ItemName: this.ItemName,
        Category: this.Category,
        Quantity: this.Quantity,
        Status: this.Status,
        Unit:this.Unit,
        ReorderLevel:this.ReorderLevel,
        Supplier: this.Supplier,
        Username: this.reportusername,
        ItemID: this.data.ItemID

      }]),
      spname: "[dbo].[sp_Update_KitchenInventory]"
    };

    console.log("Payload:", Payload);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      Payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Inventory submitted successfully!');
        this.closeDialog();
         this.dialogRef.close('updated');
      },
      error: (err) => {
        console.error('Error inserting Inventory', err);
        alert('Failed to submit Inventory.');
      }
    });
  }



  resetForm(): void {
      this.ItemName ='',
      this.Category ='',
      this.Quantity ='',
      this.Status ='',
      this.Unit ='',
      this.ReorderLevel ='',
      this.Supplier ='',
      this.reportusername =''
  }

    closeDialog() {
    this.dialogRef.close();
  }

}
