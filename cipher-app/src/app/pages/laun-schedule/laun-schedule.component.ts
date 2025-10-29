import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Machine {
  ID: number | string;
  Machine: string;
}

@Component({
  selector: 'app-laun-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laun-schedule.component.html',
  styleUrl: './laun-schedule.component.css'
})
export class LaunScheduleComponent implements OnInit {
  reportusername: string | null = null;
  reportrole: string | null = null;
  reportuserid: number | null = null;

  Machine: Machine[] = [];
  selectedMachineID: number | string | null = null;
 
  MachineID: number | string | null = null;
  StartTime: string = '';
  EndTime: string | null = null;
  isEditMode: boolean = false;
  Status: string = '';
  // username: string = 'Admin'; 

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
    private dialogRef: MatDialogRef<LaunScheduleComponent>,
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
  this.loadMachine();
   // Log the data received from the dialog
  
console.log('Dialog opened with data:', this.data); 

if (this.data) {
  this.isEditMode = true;
  this.selectedMachineID = this.data.MachineID || '';
  this.StartTime = this.data.StartTime || '';
  this.EndTime = this.data.EndTime || '';
}
}

// Load Machine names from SP
  loadMachine(): void {
    const params = new HttpParams().set('spname', "select MachineID ID,concat(MachineName,'-',MachineType) Machine from dbo.[LaundryMachineMaster]");

    this.http.get<any[]>(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC',
      { params }
    ).subscribe({
      next: (res) => {
        console.log('Meal API Response:', res);
        this.Machine = (res || [])
          .map((d: any) => ({
            ID: d?.ID ?? d?.ID ?? d?.ID ?? d?.ID,
            Machine: d?.Machine ?? d?.Machine ?? d?.Machine ?? d?.Machine
          }))
          .filter(d => d.ID && d.Machine);
      },
      error: (err) => console.error('Error loading Machine', err)
    });
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.selectedMachineID || !this.StartTime || !this.EndTime) {
      alert('Please select a Machine and choose a Slot.');
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([{
        MachineID: this.selectedMachineID,
        StartTime: this.StartTime,
        EndTime: this.EndTime ,
        Username: this.reportusername,
      }]),
      spname: "[dbo].[sp_Insert_LaundrySchedule]"
    };

    console.log("Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Machine scheduled successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error Machine scheduling', err);
        alert('Failed to schedule Machine.');
      }
    });
  }

    UpdateSchedule(): void {
    // if () {
    //   alert('Please select a Machine and choose a Slot.');
    //   return;
    // }

    const payload = {
      JSONFileparams: JSON.stringify([{
        MachineID: this.selectedMachineID,
        StartTime: this.StartTime,
        EndTime: this.EndTime ,
        Status: this.data.Status,
        Username: this.reportusername,
        ScheduleID: this.data?.ScheduleID,
      }]),
      spname: "[dbo].[sp_Update_LaundrySchedule]"
    };

    console.log("Payload:", payload);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        alert('Schedule Updated successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error in Scheduling Machine', err);
        alert('Failed to schedule Machine.');
      }
    });
  }


  resetForm(): void {
this.selectedMachineID ='',
this.StartTime =' ',
this.EndTime = ''
 }

    closeDialog() {
    this.dialogRef.close();
  }
 

}
