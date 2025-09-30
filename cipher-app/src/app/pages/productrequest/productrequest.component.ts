import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../services/user-data.service';

@Component({
 selector: 'app-productrequest',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './productrequest.component.html',
  styleUrl: './productrequest.component.css'
})
export class ProductrequestComponent {
  subjectForm!: FormGroup;  // declare here
role : string = '';
reportuserid:string='';
reportusername:string='';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar, private dialogRef: MatDialogRef<ProductrequestComponent>,private userDataService: UserDataService
  ) {
    // initialize inside constructor
    this.subjectForm = this.fb.group({
      RoleName: [''],
      Item_Name: ['', Validators.required],
      Category: ['', Validators.required],
      Quantity: ['',Validators.required],
      Location: ['',Validators.required],
      Status: ['']
    });
  }
   closeDialog() {
    this.dialogRef.close();
  }

  // onSubmit() {
  //   if (this.subjectForm.valid) {
  //     const payload = this.subjectForm.value;

  //     // Build HttpParams like your backend expects
  //     let params = new HttpParams()
  //       .set("spname", "[dbo].[sp_insert_inventory_detail]")
  //       .set("spparameter1", "@RoleName").set("parameter1", this.role || '')
  //       .set("spparameter2", "@ItemName").set("parameter2", payload.ItemName || '')
  //       .set("spparameter3", "@RequestedBy").set("parameter3", this.reportusername || '')
  //       .set("spparameter4", "@Quantity").set("parameter3", payload.Quantity || '')
  //       .set("spparameter5", "@Status").set("parameter3", "Pending")
  //       .set("spparameter6", "@Category").set("parameter3", payload.Category || '')
  //     this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC", { params }).subscribe({
  //       next: () => {
  //         this.snackBar.open("Saved successfully!", "Close", { duration: 3000 });
  //         this.subjectForm.reset();
  //       },
  //       error: () => {
  //         this.snackBar.open("Error Saving", "Close", { duration: 3000 });
  //       }
  //     });
  //   }
  // }

onSubmit() {
   console.warn("Request Payload:", '');
      const payload = this.subjectForm.value;
  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      RequestID: '',
      RoleName: this.role || 'Admin',          
      ItemName: payload.Item_Name || '',
      RequestedBy: this.reportusername || '',
      Quantity: payload.Quantity || '',    
      Status: payload.Status || 'Requested',  
      Category: payload.Category || '',   
    }
  ]),
  spname: "[dbo].[sp_insert_item_request]"
};
 
 console.log("Request Payload:", JSON.stringify(requestData, null, 2));
  const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';
 
   this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
    next: (response) => {
      if (response.trim().toLowerCase() === "success") {
        // alert('User updated successfully');
         this.snackBar.open('Saved successfully', 'Close', {
      duration: 3000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style
    });
        this.dialogRef.close('updated'); // ✅ Send signal to refresh
      } else {
        alert('Failed to Add Stock.');
      }
    },
    error: (error) => {
      console.error("API Error:", error);
      alert('Error updating user.');
    }
  });

}

  ngOnInit(): void {
 let rawUserData = this.userDataService.getUserData();
  //   this.role = (rawUserData[0].RoleName || '').toLowerCase();
   if (typeof rawUserData === 'string') {
      try {
        rawUserData = JSON.parse(rawUserData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        rawUserData = [];
      }
    }

    if (Array.isArray(rawUserData) && rawUserData.length > 0) {
      this.reportuserid = rawUserData[0].UserID || null;
      this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
      this.role = (rawUserData[0].RoleName || '').toLowerCase();
     
      
    }

  }
}


