import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { LaunManFeedbackComponent } from '../laun-man-feedback/laun-man-feedback.component';
import { AddLaunreqComponent } from '../add-launreq/add-launreq.component';
import { LaundAddmachineComponent } from '../laund-addmachine/laund-addmachine.component';
import { LaunScheduleComponent } from '../laun-schedule/laun-schedule.component';
import { LaunreqEditComponent } from '../launreq-edit/launreq-edit.component';

interface LaundryRequests {
RequestID:number;
Name:string;
Items:string;
RequestTime:string;
Status:string;
CompletedTime:string;
InsertedBy:string;
InsertedDate:string;
UpdatedBy:string;
UpdatedDate:string;
}

interface LaundrySchedule {
  ScheduleID:number;
  MachineName:string;
	Slot:string;
	Name:string;
	Status:string;
	InsertedBy:string;
	InsertedDate:string;
	UpdatedBy:string;
	UpdatedDate:string;
}

interface MachineStatus {
  MachineID:number;
  MachineName:string;
	MachineType:string;
	Location:string;
	Status:string;
	CapacityKG:string;
	LastServicedDate:string;
	InsertedBy:string;
	InsertedDate:string;
	UpdatedBy:string;
	UpdatedDate:string;
}

interface Feedback {
  FeedbackID:number;
	Name:string;
	Service:string;
	Rating:number;
	Comment:string;
	FeedbackDate:string;
	InsertedBy:string;
	InsertedDate:string;
	UpdatedBy:string;
	UpdatedDate:string;

}

@Component({
  selector: 'app-laundry-management',
  imports: [  CommonModule, FormsModule, HttpClientModule, MatDialogModule ],
  templateUrl: './laundry-management.component.html',
  styleUrl: './laundry-management.component.css'
})
export class LaundryManagementComponent { // implements OnInit 

 laundryrequest:boolean=true;
 machinestatus:boolean=false;
  schedule:boolean=false;
  feedback:boolean=false;
 activeTab: string = 'laundryrequest'; 

  LaundryRequests : LaundryRequests[] = [];
  LaundryRequestsfil : LaundryRequests[] = [];
  LaundryRequestsSearchTerm: string = '';

  LaundrySchedule: LaundrySchedule[] = [];
  LaundrySchedulefil: LaundrySchedule[] = [];
  LaundryScheduleSearchTerm: string = '';

  MachineStatus: MachineStatus[] = [];
  MachineStatusfil: MachineStatus[] = [];
  MachineStatusSearchTerm: string = '';

  Feedback : Feedback[] = [];
  Feedbackfil : Feedback[] = [];
  FeedbackSearchTerm: string = '';


constructor(private http: HttpClient, private dialog: MatDialog) {}
switchTab(userdata:string){
if(userdata=="laundryrequest"){
  this.laundryrequest=true;
  this.machinestatus=false;
  this.schedule=false;
  this.feedback=false;
 this.activeTab = 'laundryrequest';}

 else if(userdata=="machinestatus"){
  this.laundryrequest=false;
  this.machinestatus=true;
  this.schedule=false;
  this.feedback=false; 
  this.activeTab = 'machinestatus';}

  else if(userdata=="schedule"){
  this.laundryrequest=false;
  this.machinestatus=false;
  this.schedule=true;
  this.feedback=false; 
  this.activeTab = 'schedule';}

   else if(userdata=="feedback"){
  this.laundryrequest=false;
  this.machinestatus=false;
  this.schedule=false;
  this.feedback=true; 
  this.activeTab = 'feedback';}
}

ngOnInit(): void {
  this.loadLaundryRequests().subscribe((LaundryRequests: any) => {
    console.log("API Raw Response:", LaundryRequests);
    this.LaundryRequests = LaundryRequests;
    this.LaundryRequestsfil = LaundryRequests;
     // assign the full array
    console.warn("LaundryRequests", this.LaundryRequests);
  });

    this.loadFeedback().subscribe((Feedback: any) => {
    console.log("API Raw Response:", Feedback);
    this.Feedback = Feedback;
    this.Feedbackfil = Feedback;
     // assign the full array
    console.warn("Feedback", this.Feedback);
  });

    this.loadLaundrySchedule().subscribe((LaundrySchedule: any) => {
    console.log("API Raw Response:", LaundrySchedule);
    this.LaundrySchedule = LaundrySchedule;
    this.LaundrySchedulefil = LaundrySchedule;
     // assign the full array
    console.warn("LaundrySchedule", this.LaundrySchedule);
  });

    this.loadMachineStatus().subscribe((MachineStatus: any) => {
    console.log("API Raw Response:", MachineStatus);
    this.MachineStatus = MachineStatus;
    this.MachineStatusfil = MachineStatus;
     // assign the full array
    console.warn("MachineStatus", this.MachineStatus);
  });


}

  loadLaundryRequests() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_LaundryRequests]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadFeedback() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_select_LaundryFeedback]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadLaundrySchedule() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_LaundrySchedule]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadMachineStatus() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_LaundryMachineMaster]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    filterLaundrySchedule() {
    const term = this.LaundryScheduleSearchTerm.toLowerCase();
    this.LaundrySchedule = this.LaundrySchedulefil.filter((item: LaundrySchedule) =>
      item.MachineName.toLowerCase().includes(term) ||
      item.Slot?.toLowerCase().includes(term) ||
      String(item.Slot)?.toLowerCase().includes(term) ||
      item.Name?.toLowerCase().includes(term)
    );
  }

    filterLaundryRequests() {
    const term = this.LaundryRequestsSearchTerm.toLowerCase();
    this.LaundryRequests = this.LaundryRequestsfil.filter((item: LaundryRequests) =>
      item.Name.toLowerCase().includes(term) ||
      item.Items?.toLowerCase().includes(term) ||
      String(item.RequestTime)?.toLowerCase().includes(term) 
      // item.Status?.toLowerCase().includes(term)
    );
  }

    filterMachineStatus() {
    const term = this.MachineStatusSearchTerm.toLowerCase();
    this.MachineStatus = this.MachineStatusfil.filter((item: MachineStatus) =>
      item.MachineType.toLowerCase().includes(term) ||
      item.MachineName?.toLowerCase().includes(term) ||
      item.Status?.toLowerCase().includes(term) 
      // item.Status?.toLowerCase().includes(term)
    );
  }


    filterFeedback() {
    const term = this.FeedbackSearchTerm.toLowerCase();
    this.Feedback = this.Feedbackfil.filter((item: Feedback) =>
      item.Name.toLowerCase().includes(term) ||
      item.Service?.toLowerCase().includes(term) ||
      String(item.Rating)?.toLowerCase().includes(term) ||
      item.Comment?.toLowerCase().includes(term)
    );
  }


    exportLaundryRequestsdata(): void {
      console.log("💾 Exporting Kitchen Inventory data...");
     
      if (!this.LaundryRequests || !this.LaundryRequests.length) {
        console.warn("⚠️ No Laundry Requests data available.");
        alert("No Laundry Requests data to export.");
        return;
      }
     
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.LaundryRequests);
     
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laundry Requests Data");
     
      // Write workbook
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
     
      saveAs(blob, "LaundryRequests_data.xlsx");
      console.log("✅ Data export complete");
    }
  
    exportLaundrySchedule(): void {
      console.log("💾 Exporting Laundry Schedule data...");
     
      if (!this.LaundryRequests || !this.LaundryRequests.length) {
        console.warn("⚠️ No Laundry Schedule data available.");
        alert("No Laundry Schedule data to export.");
        return;
      }
     
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.LaundrySchedule);
     
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laundry Schedule Data");
     
      // Write workbook
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
     
      saveAs(blob, "LaundrySchedule_data.xlsx");
      console.log("✅ Data export complete");
    }
    
    exportMachineStatus(): void {
      console.log("💾 Exporting Machine Status data...");
     
      if (!this.MachineStatus || !this.MachineStatus.length) {
        console.warn("⚠️ No Machine Status data available.");
        alert("No Machine Status data to export.");
        return;
      }
     
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MachineStatus);
     
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Machine Status Data");
     
      // Write workbook
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
     
      saveAs(blob, "MachineStatus_data.xlsx");
      console.log("✅ Data export complete");
    }

    
    exportFeedbackdata(): void {
      console.log("💾 Exporting Kitchen Inventory data...");
     
      if (!this.Feedback || !this.Feedback.length) {
        console.warn("⚠️ No Feedback data available.");
        alert("No Feedback data to export.");
        return;
      }
     
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Feedback);
     
      // Create workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
     
      // Write workbook
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
     
      saveAs(blob, "LaundryFeedback_data.xlsx");
      console.log("✅ Data export complete");
    }

 openMOAddFeedback() {
    console.log('Opening dialog with subject:');
     this.dialog.open(LaunManFeedbackComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container'
     });
  }

 openAddLaunreq() {
    console.log('Opening dialog with subject:');
    const dialogRef = this.dialog.open(AddLaunreqComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container'
       
     });
      dialogRef.afterClosed().subscribe(result => {
    if (result === 'updated') {
      console.log('Dialog closed with update signal — refreshing data...');
      this.loadLaundryRequests(); // 🔄 reload your data
    }
  });
  }
  
 openEditLaunreq(LaundryRequests?: any) {
    console.log('Opening edittt');
    console.log('Opening dialog with subject:', LaundryRequests);
     // ✅ assign dialogRef to capture close event
  const dialogRef = this.dialog.open(AddLaunreqComponent, {
    width: '450px',
    height: '100vh',
    position: { right: '0px', top: '0px' },
    panelClass: 'custom-dialog-container',
    data: LaundryRequests || null
  });

  // ✅ handle refresh on close
  dialogRef.afterClosed().subscribe(result => {
    if (result === 'updated') {
      console.log('Dialog closed with update signal — refreshing data...');
      this.loadLaundryRequests(); // 🔄 reload your data
    }
  });
  }



 openAddmachine() {
    console.log('Opening dialog with subject:');
     this.dialog.open(LaundAddmachineComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container'
     });
  }

   openEditmachine(MachineStatus?: any) {
    console.log('Opening edit');
    console.log('Opening edit dialog with subject:', MachineStatus);
     this.dialog.open(LaundAddmachineComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container',
       data: MachineStatus || null
     });
  }

   openSchedule() {
    console.log('Opening dialog with subject:');
     this.dialog.open(LaunScheduleComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container'
     });
  }

     openEditSchedule(LaundrySchedule?: any) {
    console.log('Opening dialog with subject:');
     this.dialog.open(LaunScheduleComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container',
       data: LaundrySchedule || null
     });
  }


   openLaunreqedit() {
    console.log('Opening dialog with subject:');
     this.dialog.open(LaunreqEditComponent, {
       width: '450px',
       height: '100vh',    
       position: { right: '0px', top: '0px' },
       panelClass: 'custom-dialog-container'
     });
  }


}
