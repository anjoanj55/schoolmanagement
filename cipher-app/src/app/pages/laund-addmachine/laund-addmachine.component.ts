import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-laund-addmachine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laund-addmachine.component.html',
  styleUrl: './laund-addmachine.component.css'
})

export class LaundAddmachineComponent implements OnInit {

  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  MachineName: string = '';
  MachineType:string='';
  Location:string=''
  Status:string=''
  CapacityKG: string='1';
  LastServicedDate:string='';
  Username:string='';
  MachineID: number | null = null;
  isEditMode: boolean = false; 


  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<LaundAddmachineComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
) {console.log('Received data in AddmachineComponent:', this.data);}

ngOnInit(): void {
  let rawUserData: any = this.userDataService?.getUserData() || null;
  // console.log('Raw userData for report:', rawUserData);

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
  this.MachineName = this.data.MachineName || '';
  this.MachineType = this.data.MachineType || '';
  this.Location = this.data.Location || '';
  this.Status = this.data.Status || '';
  this.CapacityKG = this.data.CapacityKG || '1';
  this.LastServicedDate = this.data.LastServicedDate || '';
  this.Username = this.data.Username || '';
}
   
}

  // Submit feedback
  submitFeedback(): void {
    if (!this.MachineName || !this.MachineType) {
      alert('Please select a Machine Name and Type.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        MachineName: this.MachineName,
        MachineType: this.MachineType,
        Location: this.Location,
        Status: this.Status,
        CapacityKG: this.CapacityKG,
        LastServicedDate: this.LastServicedDate,
        Username: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_LaundryMachineMaster]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Machine added successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error inserting machine', err);
        alert('Failed to add machine. Please try again.');
      }
    });
  }

  UpdateMachine(): void {
    if (!this.MachineName || !this.MachineType) {
      alert('Please select a Machine Name and Type.');
      return;
    }

    const payload = {
      JSONFileparams: JSON.stringify([{
        MachineName: this.MachineName,
        MachineType: this.MachineType,
        Location: this.Location,
        Status: this.Status,
        CapacityKG: this.CapacityKG,
        LastServicedDate: this.LastServicedDate,
        Username: this.reportusername,
        MachineID: this.data?.MachineID,
      }]),
      spname: "[dbo].[sp_Update_LaundryMachineMaster]"
    };

  this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Machine Updated successfully!');
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error Updating machine', err);
        alert('Failed to Update machine. Please try again.');
      }
    });
  }

  resetForm(): void {
      this.MachineName ='',
      this.MachineType ='',
      this.Location ='',
      this.Status ='',
      this.CapacityKG = '0'
      this.LastServicedDate ='',
      this.reportusername =''
  }

    closeDialog() {
    this.dialogRef.close();
  }


}
