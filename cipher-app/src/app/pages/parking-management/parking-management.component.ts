import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

interface ParkingManagement {
 ParkingKey: number;
 SlotNumber: string;
 SensorID: string;
 IsOccupied: string;
 VehicleNumber: string;
 EntryTime: string;
 ExitTime: string;
 Status: string;
 ParkingArea: string;
 LastUpdated: string;
 StartDate: string;
 EndDate: string;
 IsCurrent: string;
 VersionNo: string;
}

@Component({
  selector: 'app-parking-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,  // << add this
    MatDialogModule
  ],
  templateUrl: './parking-management.component.html',
  styleUrl: './parking-management.component.css'
})
export class ParkingManagementComponent implements OnInit  {

    ParkingManagement : ParkingManagement[] = [];
    totalspot: number = 0;
    available : number = 0;
    occupied : number = 0;
    Occupancypercentage:string = '0.00';
    ParkingArea: string[] = [];

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    getSpotIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'available': return '🚙';
    case 'occupied': return '🚗';
    case 'reserved': return '🔒';
    case 'maintenance': return '🔧';
    default: return '❓';
  }
}
    ngOnInit(): void {
  this.loadParkingManagement().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.ParkingManagement = res; // assign the full array
    console.warn("ParkingManagement", this.ParkingManagement);
  });

  this.loadtotalspot().subscribe((res: any) => {
  this.totalspot = res[0].totalspot;  // now it's a number
  console.warn("totalspot", this.totalspot);
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

  loadParkingManagement() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_ParkingManagement]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadtotalspot() {
let params1 = new HttpParams().set(
  'spname',
  "select count(distinct slotNumber) totalspot from [dbo].[ParkingManagement]");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadavailable() {
let params1 = new HttpParams().set(
  'spname',
  "select count(Status) available from [dbo].[ParkingManagement] where status = 'Available' and Iscurrent = 1");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadoccupied() {
let params1 = new HttpParams().set(
  'spname',
  "select count(Status) occupied from [dbo].[ParkingManagement] where status = 'Occupied' and Iscurrent = 1");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadOccupancypercentage() {
let params1 = new HttpParams().set(
  'spname',
  "SELECT CAST((COUNT(CASE WHEN Status = 'Occupied' THEN 1 END) * 100.0) / COUNT(*)AS DECIMAL(5,2)) AS Occupancypercentage FROM dbo.ParkingManagement;");
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

//  refreshData() {
//     this.loadParkingManagement().subscribe((res: any) => {
//       this.ParkingManagement = res;
//       console.log('Data refreshed:', this.ParkingManagement);
//     });
//   }


}
