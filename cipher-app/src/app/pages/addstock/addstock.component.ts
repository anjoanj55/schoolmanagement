import { Component,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-addstock',
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
    RouterModule,
  ],
 templateUrl: './addstock.component.html',
  styleUrl: './addstock.component.css'
})
export class AddstockComponent {
  subjectForm!: FormGroup;  // declare here
Item_Name:string='';
ItemID:number=0;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddstockComponent>,@Inject(MAT_DIALOG_DATA) public data: any
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
  //       .set("spparameter2", "@RoleName").set("parameter1", payload.RoleName || '')
  //       .set("spparameter2", "@ItemName").set("parameter2", payload.Item_Name || '')
  //       .set("spparameter3", "@Category").set("parameter3", payload.Category || '')
  //       .set("spparameter4", "@Quantity").set("parameter4", payload.Quantity || '')
  //       .set("spparameter4", "@Location").set("parameter5", payload.Location || '')
  //       .set("spparameter5", "@Status").set("parameter6", payload.Status  || '');

  //     this.http.post("https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC", { params }).subscribe({
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

   ngOnInit(): void {
console.warn("data", this.data)
 this.subjectForm.patchValue({
    Item_Name: this.data.userData.ItemName || '',
    Category: this.data.userData.Category || '',
     Quantity: this.data.userData.Quantity || '',
      Location: this.data.userData.Location || '',
       Status: this.data.userData.Status || '',
     ItemID:this.data.userData.ItemID
  });
  
   }
onSubmit() {
  
 if (this.subjectForm.valid) {
      const payload = this.subjectForm.value;
  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      itemid:this.data.userData.ItemID||null,
      RoleName: payload.RoleName || 'Admin',          
      ItemName: payload.Item_Name || '',
      Category: payload.Category || '',
      Quantity: payload.Quantity || '',
      Location: payload.Location || '',
      Status: payload.Status || ''  ,
    }
  ]),
  spname: "[dbo].[sp_insert_inventory_detail]"
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
}

}


