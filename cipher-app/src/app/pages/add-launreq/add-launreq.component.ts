import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-launreq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-launreq.component.html',
  styleUrl: './add-launreq.component.css'
})
export class AddLaunreqComponent implements OnInit {

  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  Items: string = '';
  Remarks:string='';
  Username:string='';
    isEditMode: boolean = false; 
    Status : string = '';

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<AddLaunreqComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      
) {console.log('Received data in AddLaunreqComponent:', this.data);}

// ngOnInit(): void {
//   let rawUserData: any = this.userDataService?.getUserData() || null;
//   console.log('Raw userData for report:', rawUserData);

//   if (typeof rawUserData === 'string') {
//     try {
//       rawUserData = JSON.parse(rawUserData);
//     } catch (e) {
//       console.error('Failed to parse user data:', e);
//       rawUserData = [];
//     }
//   }

//   if (Array.isArray(rawUserData) && rawUserData.length > 0) {
//     this.reportuserid = rawUserData[0]?.UserID || null;
//     this.reportusername = (rawUserData[0]?.UserName || '').toLowerCase();
//     this.reportrole = (rawUserData[0]?.RoleName || '').toLowerCase();
//   }

//   console.log('Report UserID:', this.reportuserid);
//   console.log('Report Username:', this.reportusername);
//   console.log('Report Role:', this.reportrole);
   
  
// console.log('Dialog opened with data:', this.data); 
  
// }

ngOnInit(): void {
    let rawUserData: any = this.userDataService?.getUserData() || null;

    if (typeof rawUserData === 'string') {
      try {
        rawUserData = JSON.parse(rawUserData);
      } catch {
        rawUserData = [];
      }
    }

    if (Array.isArray(rawUserData) && rawUserData.length > 0) {
      this.reportuserid = rawUserData[0]?.UserID || null;
      this.reportusername = (rawUserData[0]?.UserName || '').toLowerCase();
      this.reportrole = (rawUserData[0]?.RoleName || '').toLowerCase();
    }

    // ✅ Check if dialog opened with existing data (edit mode)
    if (this.data) {
      this.isEditMode = true;
      this.Items = this.data.Items || '';
      this.Remarks = this.data.Remarks || '';
      this.Status = this.data.Status || '';
      this.Username = this.data.Name || '';
    }
  }


  // Submit feedback
  submitFeedback(): void {
    if (!this.Items ) {
      // || !this.MachineType) {
      alert('Please select a Item.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        Items: this.Items,
        Remarks: this.Remarks,
        Username: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_LaundryRequests]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Request submitted successfully!');
        this.resetForm();
        this.dialogRef.close('updated');
      },
      error: (err) => {
        console.error('Error inserting Request', err);
        alert('Failed to submit Request.');
      }
    });
  }
  

  updateRequest(): void {
    if (!this.Items) {
      alert('Please enter the Items.');
      return;
    }

    const payload = {
      JSONFileparams: JSON.stringify([{
        Items: this.Items,
        Status: this.Status,
        Remarks: this.Remarks,
        RequestID: this.data?.RequestID,
        Username: this.reportusername,

      }]),
      spname: "[dbo].[sp_Update_LaundryRequests]"
    };

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Request updated successfully!');
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error updating Request', err);
        alert('Failed to update Request.');
      }
    });
  }
  resetForm(): void {
      this.Items ='',
      this.Remarks =''
      this.Status =''
  }

    closeDialog() {
    this.dialogRef.close();
  }


}
