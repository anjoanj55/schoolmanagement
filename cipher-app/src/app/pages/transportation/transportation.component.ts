import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverInformationActionComponent } from '../driver-information-action/driver-information-action.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RoutehistoryactionComponent } from '../routehistoryaction/routehistoryaction.component';
import { RfidTrackingActionComponent } from '../rfid-tracking-action/rfid-tracking-action.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
 
 
 
interface RFIDTracking {
  'RFID_TAG': string;
  Vehicle: string;
  'Last_Seen': string;
  Location: string;
  Status: string;
  capacity:string;
  Name:string;
  created_at:string;
  vehicle_number:string;
}
 
interface Drivers {
  driver_id: string;
  Name: string;
  DriverID: string;
  license_number: string;
  Experience: string;
  Rating:string;
  age:number;
}
 
interface Feedback {
  Feedbackid: string;
  Name: string;
  rating: string;
  comment: string;
  username: string;
  date:string;
}
 
interface Route {
  route_id: string;
  Date: string;
  Route: string;
  Distance: string;
  Duration: string;
  Vehicle:string;
  Status:string;
}
 
@Component({
  selector: 'app-transportation',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule,MatDialogModule],
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.css'],
 
})
export class TransportationComponent implements OnInit {
 
  RFIDdata: RFIDTracking[] = [];
  filteredData: RFIDTracking[] = [];
  searchTerm: string = '';
  sortAsc: boolean = true;
 
  Driversdata : Drivers[] = [];
  filteredDriverData: Drivers[] = [];
   driverSearchTerm: string = '';
 
 
  Feedbackdata : Feedback[] = [];
  filteredFeedbackdata: Feedback[] = [];
  FeedbackSearchTerm: string = '';
 
  Routedata : Route[] = [];
  filteredRoutedata : Route[] = [];
  RouteSearchTerm: string = '';
 
  ActiveVehicles: number = 0;
  AvgRating: number = 0;
 
  UserSatisfaction : string = ''
  DriverRating : string = ''
  TrainingNeeds : string = ''
  LowSatisfaction : string = ''
  Improvement : string = ''
  AvgRatingChange : string = ''
  AvgRatingDiffSysInsight : string = ''
  RouteEfficiency : string = ''
  TrafficAnalysis : string = ''
 
  // UI flags
  transpotaion: boolean = true;
  routes: boolean = false;
  Driver: boolean = false;
  feedback: boolean = false;
 
  constructor(private http: HttpClient, private dialog: MatDialog) {}
 
  switchTab(tabdata: string) {
    this.transpotaion = tabdata === 'rfid';
    this.routes = tabdata === 'routes';
    this.Driver = tabdata === 'drivers';
    this.feedback = tabdata === 'feedback';
  }
 
  ngOnInit(): void {
    this.loadRFIDTracking().subscribe({
      next: (RFIDTracking: any) => {
        console.warn('RFIDdata', RFIDTracking);
        this.RFIDdata = RFIDTracking;
        this.filteredData = RFIDTracking; // initialize table
      },
      error: (err) => {
        console.error('Error loading RFID data:', err);
      }
    });
        this.loadDrivers().subscribe({
      next: (Drivers: any) => {
        console.warn('Driversdata', Drivers);
        this.Driversdata = Drivers;
        this.filteredDriverData = Drivers; // initialize table
      },
      error: (err) => {
        console.error('Error loading Drivers data:', err);
      }
    });
        this.loadFeedback().subscribe({
      next: (Feedback: any) => {
        console.warn('Feedbackdata', Feedback);
        this.Feedbackdata = Feedback;
        this.filteredFeedbackdata = Feedback; // initialize table
      },
      error: (err) => {
        console.error('Error loading Feedback data:', err);
      }
    });
              this.loadRoute().subscribe({
      next: (Route: any) => {
        console.warn('Routedata', Route);
        this.Routedata = Route;
        this.filteredRoutedata = Route; // initialize table
      },
      error: (err) => {
        console.error('Error loading Drivers data:', err);
      }
    });
  this.loadtest().subscribe((res: any) => {
  this.ActiveVehicles = res[0].ActiveVehicles;  // now it's a number
  console.warn("Vehicles", this.ActiveVehicles);
});
  this.loadAvgRating().subscribe((res: any) => {
  this.AvgRating = res[0].AverageRating;  // now it's a number
  console.warn("AvgRating", this.AvgRating);
});
 
this.loadUserSatisfaction().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.UserSatisfaction = res[0].InsightSummary;   // ✅ use InsightSummary
  console.warn("UserSatisfaction", this.UserSatisfaction);
});
 
this.loadDriverRating().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.DriverRating = res[0].DriverRating;   // ✅ use InsightSummary
  console.warn("DriverRating", this.DriverRating);
});
 
this.loadTrainingNeeds().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.TrainingNeeds = res[0].TrainingNeeds;   // ✅ use InsightSummary
  console.warn("TrainingNeeds", this.TrainingNeeds);
});
 
this.loadLowSatisfaction().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.LowSatisfaction = res[0].LowSatisfaction;   // ✅ use InsightSummary
  console.warn("LowSatisfaction", this.LowSatisfaction);
});
 
this.loadImprovement().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.Improvement = res[0].Improvement;   // ✅ use InsightSummary
  console.warn("Improvement", this.Improvement);
});
 
this.loadAvgRatingChange().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.AvgRatingChange = res[0].AvgRatingChange;   // ✅ use InsightSummary
  console.warn("AvgRatingChange", this.AvgRatingChange);
});
 
this.loadAvgRatingDiffSysInsight().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.AvgRatingDiffSysInsight = res[0].AvgRatingChg;   // ✅ use InsightSummary
  console.warn("AvgRatingDiffSysInsight", this.AvgRatingDiffSysInsight);
});
 
this.loadRouteEfficiency().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.RouteEfficiency = res[0].RouteEfficiency;   // ✅ use InsightSummary
  console.warn("RouteEfficiency", this.RouteEfficiency);
});
 
this.loadTrafficAnalysis().subscribe((res: any) => {
  console.log("API Raw Response:", res);
  this.TrafficAnalysis = res[0].RouteDelayMessage;   // ✅ use InsightSummary
  console.warn("TrafficAnalysis", this.TrafficAnalysis);
});
 
 
}
  loadRFIDTracking() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_select_RFID_Tracking]');
    return this.http.get<RFIDTracking[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadDrivers() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_DriverInformation]');
    return this.http.get<Drivers[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
      loadFeedback() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_Feedback]');
    return this.http.get<Feedback[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
          loadRoute() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_RouteHistory]');
    return this.http.get<Route[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
loadtest() {
let params1 = new HttpParams().set(
  'spname',
  "select count(vehicle_number) ActiveVehicles from [dbo].[transport_vehicles] where status = 'Active'");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
  loadAvgRating() {
let params1 = new HttpParams().set(
  'spname',
  "SELECT CAST(AVG(CAST(rating AS DECIMAL(10,2))) AS DECIMAL(3,1)) AS AverageRating FROM [dbo].[transport_feedback] where rating is not null;");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
  loadRouteEfficiency() {
let params1 = new HttpParams().set(
  'spname',
  "select top 1 concat(route_name,' route shows faster travel time due to optimized paths.') RouteEfficiency from [dbo].[transport_routes] order by estimated_time");
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadUserSatisfaction() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_UserSatisfaction]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadDriverRating() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_DriverRatings]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadTrainingNeeds() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_TrainingNeeds]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadLowSatisfaction() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_LowUserSatisfaction]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
    loadImprovement() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_ImprovementSuggestions]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
  loadAvgRatingChange() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_AvgRatingDifference]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
  loadAvgRatingDiffSysInsight() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_AvgRatingDiffSysInsight]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
  loadTrafficAnalysis() {
let params1 = new HttpParams().set(
  'spname', '[dbo].[sp_Select_TrafficAnalysis]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }
 
 
 
  // 🔍 filter/search
  filterTable() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.RFIDdata.filter((item: RFIDTracking) =>
      item['RFID_TAG']?.toLowerCase().includes(term) ||
      item.Vehicle?.toLowerCase().includes(term) ||
      item.Location?.toLowerCase().includes(term) ||
      item.Status?.toLowerCase().includes(term)
    );
  }
 
  // 🔀 sorting
  sortBy(field: keyof RFIDTracking) {
    this.sortAsc = !this.sortAsc;
    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valA = a[field] ? a[field].toString().toLowerCase() : '';
      const valB = b[field] ? b[field].toString().toLowerCase() : '';
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }
  filterDrivers() {
    const term = this.driverSearchTerm.toLowerCase();
    this.filteredDriverData = this.Driversdata.filter((driver: Drivers) =>
      driver.Name?.toLowerCase().includes(term) ||
      driver.DriverID?.toLowerCase().includes(term) ||
      driver.license_number?.toLowerCase().includes(term) ||
      String(driver.Experience)?.toLowerCase().includes(term) ||
      String(driver.Rating)?.toLowerCase().includes(term)
    );
  }
 
    filterRoute() {
    const term = this.RouteSearchTerm.toLowerCase();
    this.filteredRoutedata = this.Routedata.filter((route: Route) =>
      route.Date?.toLowerCase().includes(term) ||
      route.Route?.toLowerCase().includes(term) ||
      String(route.Distance)?.toLowerCase().includes(term) ||
      String(route.Duration)?.toLowerCase().includes(term) ||
      route.Vehicle?.toLowerCase().includes(term) ||
      route.Status?.toLowerCase().includes(term)
    );
  }
 
      filterFeedback() {
    const term = this.FeedbackSearchTerm.toLowerCase();
    this.filteredFeedbackdata = this.Feedbackdata.filter((Feedback: Feedback) =>
      Feedback.Name?.toLowerCase().includes(term) ||
      String(Feedback.rating)?.toLowerCase().includes(term) ||
      Feedback.comment?.toLowerCase().includes(term) ||
      String(Feedback.username)?.toLowerCase().includes(term) ||
      String(Feedback.date)?.toLowerCase().includes(term)
     );
  }
 
  openDetails(Driversdata: any) {
   console.log('Opening dialog with subject:', Driversdata);
    this.dialog.open(DriverInformationActionComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      data: Driversdata,
      panelClass: 'custom-dialog-container'
    });
  }
 
    openRouteDetails(Routedata: any) {
   console.log('Opening dialog with subject:', Routedata);
    this.dialog.open(RoutehistoryactionComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      data: Routedata,
      panelClass: 'custom-dialog-container'
    });
  }
      openRfidDetails(RFIDdata: any) {
   console.log('Opening dialog with subject:', RFIDdata);
    this.dialog.open(RfidTrackingActionComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      data: RFIDdata,
      panelClass: 'custom-dialog-container'
    });
  }
 
    openAddFeedback() {
   console.log('Opening dialog with subject:');
    this.dialog.open(AddFeedbackComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      panelClass: 'custom-dialog-container'
    });
  }
 
    openAssignDriver() {
   console.log('Opening dialog with subject:');
    this.dialog.open(AssignDriverComponent, {
      width: '450px',
      height: '100vh',    
      position: { right: '0px', top: '0px' },
      panelClass: 'custom-dialog-container'
    });
  }
 
  exportRFIDdata(): void {
  console.log("💾 Exporting RFID data...");
 
  if (!this.RFIDdata || !this.RFIDdata.length) {
    console.warn("⚠️ No RFID data available.");
    alert("No RFID data to export.");
    return;
  }
 
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.RFIDdata);
 
  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "RFID Data");
 
  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
 
  saveAs(blob, "RFID_data.xlsx");
  console.log("✅ Data export complete");
}
 
  exportRoutedata(): void {
  console.log("💾 Exporting Route History data...");
 
  if (!this.Routedata || !this.Routedata.length) {
    console.warn("⚠️ No Route History data available.");
    alert("No Route History data to export.");
    return;
  }
 
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Routedata);
 
  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Route History Data");
 
  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
 
  saveAs(blob, "Route_History_data.xlsx");
  console.log("✅ Data export complete");
}
 
  exportDriverdata(): void {
  console.log("💾 Exporting Driver data...");
 
  if (!this.Driversdata || !this.Driversdata.length) {
    console.warn("⚠️ No Drivers data available.");
    alert("No Drivers data to export.");
    return;
  }
 
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Driversdata);
 
  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Drivers Data");
 
  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
 
  saveAs(blob, "Drivers_data.xlsx");
  console.log("✅ Data export complete");
}
 
  exportFeedbackdata(): void {
  console.log("💾 Exporting Driver data...");
 
  if (!this.Feedbackdata || !this.Feedbackdata.length) {
    console.warn("⚠️ No Feedback data available.");
    alert("No Feedback data to export.");
    return;
  }
 
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Feedbackdata);
 
  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Feedback8520 Data");
 
  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
 
  saveAs(blob, "Feedback_data.xlsx");
  console.log("✅ Data export complete");
}
generateReport(): void {
  console.log("📑 Generating RFID data PDF report...");
 
  if (!this.RFIDdata || !this.RFIDdata.length) {
    console.warn("⚠️ No subject data available.");
    alert("No RFID data to generate report.");
    return;
  }
 
  // Helper function to format date and time as DD-MM-YYYY HH:MM:SS
  const formatDateTime = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
 
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
 
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };
 
  const tableBody = [
    [
      { text: "RFID_TAG", style: "tableHeader" },
      { text: "Name", style: "tableHeader" },
      { text: "Vehicle", style: "tableHeader" },
      { text: "Location", style: "tableHeader" },
      { text: "capacity", style: "tableHeader" },
      { text: "Last_Seen", style: "tableHeader" },
      { text: "Status", style: "tableHeader" },
      { text: "capacity", style: "tableHeader" }
    ],
    ...this.RFIDdata.map(record => [
     new Date(record.created_at).toLocaleDateString("en-GB"),
      `${record.Name}`,
      record.RFID_TAG,
      record.Vehicle,
      record.vehicle_number,
      record.Location,
      record.capacity,
      record.Last_Seen,
      record.Status,
      record.Last_Seen,
 
 
    ])
  ];
 
  const docDefinition: any = {
    content: [
      { text: " Student Performance Report", style: "header" },
      { text: `Generated on: ${formatDateTime(new Date())}`, style: "subheader" },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "auto", "auto"],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#4a90e2" : rowIndex % 2 === 0 ? "#f2f2f2" : null),
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa"
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 10,
        italics: true,
        alignment: "right",
        margin: [0, 0, 0, 10]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "white",
        fillColor: "#4a90e2",
        alignment: "center"
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };
 
  pdfMake.createPdf(docDefinition).open(); // opens in new tab
  // pdfMake.createPdf(docDefinition).download("student_performance_report.pdf"); // to download directly
}
}