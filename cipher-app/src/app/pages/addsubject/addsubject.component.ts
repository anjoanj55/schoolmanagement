// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { RouterModule } from '@angular/router';
// import { MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-addsubject',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     MatSnackBarModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     RouterModule
//   ],
//   templateUrl: './addsubject.component.html',
//   styleUrls: ['./addsubject.component.css']
// })
// export class AddsubjectComponent {
//   subjectForm!: FormGroup;

//   // Dropdown values
//   classes: string[] = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
//   subjectTypes: string[] = ['Elective', 'Core', 'All'];
//   days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   periods: number[] = [1, 2, 3, 4, 5, 6, 7];

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private snackBar: MatSnackBar,
//     private dialogRef: MatDialogRef<AddsubjectComponent>
//   ) {
//     this.subjectForm = this.fb.group({
//       role: [''],
//       subject_name: ['', Validators.required],
//       subject_code: ['', Validators.required],
//       description: [''],
//       class_name: ['', Validators.required],
//       subject_type: ['', Validators.required],
//       teacher: [''],
//       day: ['', Validators.required],
//       period_no: ['', Validators.required],
//       InsertedBy: ['']
//     });
//   }

//   closeDialog() {
//     this.dialogRef.close();
//   }

// onSubmit() {
//   if (!this.subjectForm.valid) {
//     console.warn("Form is invalid. Please check required fields.");
//     return;
//   }

//   const payload = this.subjectForm.value;
//   console.log("Form Payload:", payload);

//   const requestData = {
//     JSONFileparams: JSON.stringify([
//       {
//         role: "admin",   
//         subject_name: payload.subject_name || '',
//         subject_code: payload.subject_code || '',
//         description: payload.description || '',
//         InsertedBy: payload.InsertedBy || '',
//         classname: payload.class_name || '',
//         subjecttype: payload.subject_type || '',
//         teachername: payload.teacher || '',
//         day: payload.day || '',
//         PeriodNumber: payload.period_no || 0
//       }
//     ]),
//     spname: "[dbo].[sp_addsubject_insert]"
//   };

//   console.log("Request Payload:", JSON.stringify(requestData, null, 2));

//   const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';

//   this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
//     next: (response) => {
//       console.log("API Response:", response);

//       if (response.trim().toLowerCase() === "success") {
//         this.snackBar.open("Subject inserted successfully!", "Close", {
//           duration: 3000,
//           horizontalPosition: 'center',
//           verticalPosition: 'top',
//           panelClass: ['snackbar-success']
//         });
//         this.subjectForm.reset();
//         this.dialogRef.close('added'); 
//       } else {
//         console.warn("Failed to insert subject:", response);
//         this.snackBar.open("Failed to insert subject", "Close", { duration: 3000 });
//       }
//     },
//     error: (error) => {
//       console.error("API Error:", error);
//       this.snackBar.open("Error inserting subject", "Close", { duration: 3000 });
//     }
//   });
// }


// }


import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDataService } from '../services/user-data.service';
@Component({
  selector: 'app-addsubject',
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
  templateUrl: './addsubject.component.html',
  styleUrls: ['./addsubject.component.css']
})
export class AddsubjectComponent {
  subjectForm!: FormGroup;

  // Dropdown values
  classes: string[] = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
  subjectTypes: string[] = ['Elective', 'Core', 'All'];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods: number[] = [1, 2, 3, 4, 5, 6, 7];
  reportusername: string | null = null;
  reportrole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
     private userDataService: UserDataService,
    private dialogRef: MatDialogRef<AddsubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data for edit
  ) {
    // Initialize form
  this.subjectForm = this.fb.group({
    subject_id: [''], // for update identification
    role: [''],
    subject_name: ['', Validators.required],
    subject_code: [''],
    description: [''],
    class_name: [''],
    subject_type: [''],
    teacher: [''],
    day: [''],
    period_no: [''],
    InsertedBy: ['']
  });

    // Prefill form if editing
     if (this.data) {
    this.prefillForm(this.data);

    // Disable all fields except subject_name and teacher in edit mode
    Object.keys(this.subjectForm.controls).forEach(key => {
      if (key !== 'subject_name' && key !== 'teacher' && key !== 'subject_id') {
        this.subjectForm.controls[key].disable();
      }
    });
  }
}

  // Flag to check edit mode
  get isEditMode(): boolean {
    return !!this.data;
  }

  // Prefill form when editing
  // Prefill form with incoming data
prefillForm(subject: any) {
  this.subjectForm.patchValue({
    subject_id: subject.subject_id,
    subject_name: subject.subject_name || '',
    subject_code: subject.subject_code || '',
    description: subject.description || '',
    class_name: subject.class_names || '',      // Note: mapped from your data
    subject_type: subject.subject_type || '',
    teacher: subject.teachername || '',
    day: subject.day || '',
    period_no: subject.period_no || '',
    InsertedBy: this.reportusername || ''
  });
}

  // Close dialog
  closeDialog() {
    this.dialogRef.close();
  }

  // Add new subject
  onSubmit() {
    if (!this.subjectForm.valid) {
      console.warn("Form is invalid. Please check required fields.");
      return;
    }

    const payload = this.subjectForm.value;
    const requestData = {
      JSONFileparams: JSON.stringify([{
       role: "admin",   
        subject_name: payload.subject_name || '',
        subject_code: payload.subject_code || '',
        description: payload.description || '',
        InsertedBy: "admin",
        classname: payload.class_name || '',
        subjecttype: payload.subject_type || '',
        teachername: payload.teacher || '',
        day: payload.day || '',
        PeriodNumber: payload.period_no || 0
      }]),
      spname: "[dbo].[sp_addsubject_insert]" // Insert stored procedure
    };

    const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';

    this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
      next: (response) => {
        if (response.trim().toLowerCase() === "success") {
          this.snackBar.open("Subject inserted successfully!", "Close", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });
          this.subjectForm.reset();
          this.dialogRef.close('added'); // Notify parent
        } else {
          this.snackBar.open("Failed to insert subject", "Close", { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open("Error inserting subject", "Close", { duration: 3000 });
        console.error("API Error:", error);
      }
    });
  }

   ngOnInit(): void {

    let rawUserData = this.userDataService.getUserData();
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
     
      this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
      this.reportrole = (rawUserData[0].RoleName || '').toLowerCase();
    }

   
    console.log('Report Username:', this.reportusername);
    console.log('Report Role:', this.reportrole);
     if (this.data) {
    // Case 1: Editing existing subject → prefill with values
    this.subjectForm.patchValue({
      class_names: this.data.class_names || '',
      subject_name: this.data.subject_name || '',
      subject_code: this.data.subject_code || '',
      description: this.data.description || '',
      teachername: this.data.teachername || '',
      total_hours_per_week: this.data.total_hours_per_week || 0,
      studentcount: this.data.studentcount || 0,
    });
  } else {
    // Case 2: New subject → keep blank, dropdowns will appear
    this.subjectForm.patchValue({
      class_names: '',
      subject_name: '',
      subject_code: '',
      description: '',
      teachername: '',
      total_hours_per_week: 0,
      studentcount: 0,
    });
  }
   }
  // Update existing subject
  onUpdate() {
    if (!this.subjectForm.valid) return;

    const payload = this.subjectForm.value;
     const UpdatedBy = this.reportusername || 'system'; 
   const requestData = {
  JSONFileparams: JSON.stringify([{
    role: this.reportrole || '',          
    subject_id: payload.subject_id,      
    subject_name: payload.subject_name || '',  
    subject_code: payload.subject_code || '',                  
    description: payload.description,                    
    UpdatedBy: this.reportusername || '', 
    classname: payload.class_names,                    
    subjecttype: null,                    
    teachername: payload.teacher || '',  
    day: null,                           
    PeriodNumber: null                    
  }]),
  spname: "[dbo].[sp_addsubject_update]"
};

 console.log("API requestData:", requestData);
    const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';

    this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
  next: (response) => {
    if (response.trim().toLowerCase() === "success") {
      this.snackBar.open("Subject updated successfully!", "Close", {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });
      this.dialogRef.close('updated'); // Notify parent
    } else {
      this.snackBar.open("Failed to update subject", "Close", { duration: 3000 });
      console.error("Update failed. Response:", response);
    }
  },
  error: (error) => {
    this.snackBar.open("Error updating subject", "Close", { duration: 3000 });

    // Detailed error logging
    if (error.status) {
      console.error(`API Error: Status ${error.status} - ${error.statusText}`);
    }
    if (error.error) {
      console.error("API Error Response:", error.error);
    }
    console.error("Full error object:", error);
  }
});
  }
}
