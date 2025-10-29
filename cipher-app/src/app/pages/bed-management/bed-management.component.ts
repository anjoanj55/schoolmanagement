import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { BedmanagementPopupComponent } from '../bedmanagement-popup/bedmanagement-popup.component';

interface BedManagement {

 BedID: number;
 RoomID: number;
 RoomNumber: string;
 IsOccupied: string;
 Status: string;
 Name: string;
 occupied_from: string;
 occupied_to: string;
 HostelName: string;
 UpdatedDate: string;
 UpdatedBy: string;
 InsertedDate: string;
 InsertedBy: string;
}


@Component({
  selector: 'app-bed-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,  // << add this
    MatDialogModule
  ],
  templateUrl: './bed-management.component.html',
  styleUrl: './bed-management.component.css'
})
export class BedManagementComponent implements OnInit {

    BedManagement : BedManagement[] = [];
    totalbed: number = 0;
    available : number = 0;
    occupied : number = 0;
    Occupancypercentage:string = '0.00';
    ParkingArea: string[] = [];

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    getSpotIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'available': return '🛏️';
    case 'occupied': return '💤🛏️';
    case 'reserved': return '🔒';
    case 'maintenance': return '🔧';
    default: return '❓';
  }
}
    ngOnInit(): void {
  this.loadBedManagement().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.BedManagement = res; // assign the full array
    console.warn("BedManagement", this.BedManagement);
  });

  this.loadtotalbed().subscribe((res: any) => {
  this.totalbed = res[0].totalbed;  // now it's a number
  console.warn("totalbed", this.totalbed);
});

  this.loadavailable().subscribe((res: any) => {
  this.available = res[0].available;  // now it's a number
  console.warn("available", this.available);
});

  this.loadoccupied().subscribe((res: any) => {
  this.occupied = res[0].occupied;  // now it's a number
  console.warn("occupied", this.occupied);
});

  this.loadOccupancypercentage().subscribe((res: any) => {
  this.Occupancypercentage = res[0].Occupancypercentage;  // now it's a number
  console.warn("Occupancypercentage", this.Occupancypercentage);
});

this.loadParkingArea().subscribe((res: any) => {
  // ✅ Map the response into a string array
  this.ParkingArea = res.map((item: any) => item.ParkingArea);
  console.warn("ParkingArea", this.ParkingArea);
});

} 

  loadBedManagement() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_select_BedManagement]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadtotalbed() {
let params1 = new HttpParams().set(
  'spname',
  "select count(BedID) totalbed from [dbo].[BedManagement]");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadavailable() {
let params1 = new HttpParams().set(
  'spname',
  "select count(Status) available from [dbo].[BedManagement] where status = 'Available'");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadoccupied() {
let params1 = new HttpParams().set(
  'spname',
  "select count(Status) occupied from [dbo].[BedManagement] where status = 'Occupied'");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadOccupancypercentage() {
let params1 = new HttpParams().set(
  'spname',
  "SELECT CAST((COUNT(CASE WHEN Status = 'Occupied' THEN 1 END) * 100.0) / COUNT(*)AS DECIMAL(5,2)) AS Occupancypercentage FROM dbo.BedManagement;");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadParkingArea() {
let params1 = new HttpParams().set(
  'spname',
  "select distinct ParkingArea from dbo.ParkingManagement");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

refreshPage() {
  window.location.reload();
  }

  // 🔹 Open Bed Details Popup
  openBedDetails(bed: any) {
    // console.log('Opening dialog with subject:', bed)
    const dialogRef = this.dialog.open(BedmanagementPopupComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      panelClass: 'custom-dialog-container',
      data: bed
    });

    dialogRef.afterClosed().subscribe(updatedData => {
      if (updatedData) {
        const index = this.BedManagement.findIndex(b => b.BedID === updatedData.BedID);
        if (index > -1) {
          this.BedManagement[index] = updatedData;
        }
      }
    });
  }

}

