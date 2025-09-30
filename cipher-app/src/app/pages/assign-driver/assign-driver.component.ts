import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

type Driver = {
  DriverID: string;
  Name: string;
};

type RFIDTracking = {
  RFID_TAG: string;
  Vehicle: string;
};

@Component({
  selector: 'app-assign-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.css']
})
export class AssignDriverComponent implements OnInit {

  drivers: Driver[] = [];
  rfids: RFIDTracking[] = [];

  selectedDriver: string = '';
  selectedRfid: string = '';

  constructor(private http: HttpClient,
              private dialogRef: MatDialogRef<AssignDriverComponent>) {}

  ngOnInit(): void {
    this.loadDrivers();
    this.loadRFIDTracking();
  }

  // Load Drivers from SP
  loadDrivers() {
    const params1 = new HttpParams().set('spname', '[dbo].[sp_Select_DriverInformation]');
    this.http.get<Driver[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    ).subscribe({
      next: (res) => {
        console.log("Drivers:", res);
        this.drivers = res;
      },
      error: (err) => console.error("Error loading drivers:", err)
    });
  }

  // Load RFIDs from SP
  loadRFIDTracking() {
    const params1 = new HttpParams().set('spname', '[dbo].[sp_select_RFID_Tracking]');
    this.http.get<RFIDTracking[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    ).subscribe({
      next: (res) => {
        console.log("RFIDs:", res);
        this.rfids = res;
      },
      error: (err) => console.error("Error loading rfids:", err)
    });
  }

  // Save Assign Driver
  assignDriver() {
    if (!this.selectedDriver || !this.selectedRfid) {
      alert("Please select both driver and RFID");
      return;
    }

    const requestData = {
      JSONFileparams: JSON.stringify([
        {
          DriverID: this.selectedDriver,   // use ID instead of name
          RFID_TAG: this.selectedRfid,
        }
      ]),
      spname: "[dbo].[sp_Insert_DriverAssign]",
    };

    console.log("Request Payload:", requestData);

    this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
      requestData,
      { responseType: 'text' }
    ).subscribe({
      next: (response: any) => {
        console.log("API Response:", response);
        alert("Driver assigned successfully!");

        // ✅ Clear both dropdowns after successful assignment
        this.selectedDriver = '';
        this.selectedRfid = '';
      },
      error: (err) => {
        console.error("Error assigning driver:", err);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
