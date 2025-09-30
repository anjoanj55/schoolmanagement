import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddstockComponent } from '../addstock/addstock.component';
import { ProductrequestComponent } from '../productrequest/productrequest.component';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../services/user-data.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-stockpage',
  imports: [CommonModule,HttpClientModule,FormsModule,MatSnackBarModule],
  templateUrl: './stockpage.component.html',
  styleUrl: './stockpage.component.css'
})
export class StockpageComponent {
  lowestQuantityItemName: string = '';
 inventory:boolean=true;
 addItem:boolean=false;
 requests:boolean=false;
 activeTab: string = 'inventory'; 
 inventorydetails: User[] = [];
 filteredUsers: User[] = [];
 searchTerm: string = '';
 role : string = '';
 reportuserid:string='';
 reportusername:string='';
 processrequestdata:any;
 totalCount:number=0;
 lowStockCount:number=0;
  highStockCount:number=0;
  pedningrequests:number=0;
 constructor(private http:HttpClient,private userDataService: UserDataService,private dialog: MatDialog,private snackBar: MatSnackBar){}
approve(user: any) {
     
  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      RequestID: user.RequestID,
      Role: user.Role || 'Admin',   
      Status:'Approved',       
    }
  ]),
  spname: "[dbo].[sp_ApproveItemRequest]"
};
 
 console.log("Request Payload:", JSON.stringify(requestData, null, 2));
  const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';
 
   this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
    next: (response) => {
      if (response.trim().toLowerCase() === "success") {
        // alert('User updated successfully');
         this.snackBar.open('Approved successfully', 'Close', {
      duration: 3000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style

    });
         this.loadclassid().subscribe((loaduserdata: User[]) => {
      console.warn("loaduserdata", loaduserdata);
           this.inventorydetails = loaduserdata;
       this.filteredUsers = [...loaduserdata]; 
      this.totalCount = this.inventorydetails.length;
       this.lowStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       this.highStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;

        if(this.inventorydetails.length > 0) {
    let lowestQuantityItem = this.inventorydetails.reduce((prev, curr) => {
      return (prev.Quantity < curr.Quantity) ? prev : curr;
    });
    
    // Now you have the item with the lowest quantity
    console.log('Lowest quantity item:', lowestQuantityItem);
    this.lowestQuantityItemName = lowestQuantityItem.ItemName; // or whatever the property name is
  }
       });
      this.loadproductrequest().subscribe((productrequestdata: any) => {
      console.warn("productrequestdata", productrequestdata);
      this.processrequestdata = productrequestdata;
      this.processrequestdata = JSON.parse(this.processrequestdata);
       this.pedningrequests= this.processrequestdata.length;
       });
      } else {
        alert('Failed.');
      }
    },
    error: (error) => {
      console.error("API Error:", error);
      alert('Error updating user.');
    }
  });

}
Reject(user: any) {
  alert("Are you sure want to Reject?");     
  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      RequestID: user.RequestID,
      Role: user.Role || 'Admin',   
      Status:'Reject',       
    }
  ]),
  spname: "[dbo].[sp_ApproveItemRequest]"
};
 
 console.log("Request Payload:", JSON.stringify(requestData, null, 2));
  const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';
 
   this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
    next: (response) => {
      if (response.trim().toLowerCase() === "success") {
        // alert('User updated successfully');
         this.snackBar.open('Rejected successfully', 'Close', {
      duration: 3000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style
    });
         this.loadclassid().subscribe((loaduserdata: User[]) => {
      console.warn("loaduserdata", loaduserdata);
           this.inventorydetails = loaduserdata;
       this.filteredUsers = [...loaduserdata]; 
      this.totalCount = this.inventorydetails.length;
       this.lowStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       this.highStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;

        if(this.inventorydetails.length > 0) {
    let lowestQuantityItem = this.inventorydetails.reduce((prev, curr) => {
      return (prev.Quantity < curr.Quantity) ? prev : curr;
    });
    
    // Now you have the item with the lowest quantity
    console.log('Lowest quantity item:', lowestQuantityItem);
    this.lowestQuantityItemName = lowestQuantityItem.ItemName; // or whatever the property name is
  }
       });
      this.loadproductrequest().subscribe((productrequestdata: any) => {
      console.warn("productrequestdata", productrequestdata);
      this.processrequestdata = productrequestdata;
      this.processrequestdata = JSON.parse(this.processrequestdata);
       this.pedningrequests= this.processrequestdata.length;
       });
      } else {
        alert('Failed.');
      }
    },
    error: (error) => {
      console.error("API Error:", error);
      alert('Error.');
    }
  });

}
 openproductreq() {    
         const dialogRef = this.dialog.open(ProductrequestComponent, {
          width: '400px',
          position: { right: '0' }, 
          panelClass: 'custom-dialog-panel',
          data: null
        });
      
      
        dialogRef.afterClosed().subscribe((result: string | undefined) => {
          if (result === 'updated') { 
            this.loadproductrequest().subscribe((productrequestdata: any) => {
      console.warn("productrequestdata", productrequestdata);
      this.processrequestdata = productrequestdata;
      this.processrequestdata = JSON.parse(this.processrequestdata);
       this.pedningrequests= this.processrequestdata.length;
       });
          }
        });
   }
 editstock(user: any) {
   const userData = {
    ItemName: user.ItemName,
    Category: user.Category,
    Quantity: user.Quantity,
    Location: user.Location,
    Status: user.Status,
    ItemID: user.ItemID
         };
       const dialogRef = this.dialog.open(AddstockComponent, {
          width: '400px',
          position: { right: '0' }, 
          panelClass: 'custom-dialog-panel',
          data: { userData }
        });
      
      
        dialogRef.afterClosed().subscribe((result: string | undefined) => {
          if (result === 'updated') { 
            this.loadclassid().subscribe((loaduserdata: User[]) => {
          console.warn("loaduserdata", loaduserdata);
           this.inventorydetails = loaduserdata;
           this.filteredUsers = [...loaduserdata]; 
         this.totalCount = this.inventorydetails.length;
       this.lowStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       this.highStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
        if(this.inventorydetails.length > 0) {
    let lowestQuantityItem = this.inventorydetails.reduce((prev, curr) => {
      return (prev.Quantity < curr.Quantity) ? prev : curr;
    });
    
    // Now you have the item with the lowest quantity
    console.log('Lowest quantity item:', lowestQuantityItem);
    this.lowestQuantityItemName = lowestQuantityItem.ItemName; // or whatever the property name is
  }
       });
          }
        });
   }
 openaddstock() {
     
       const dialogRef = this.dialog.open(AddstockComponent, {
          width: '400px',
          position: { right: '0' }, 
          panelClass: 'custom-dialog-panel',
          data: null
        });
      
      
        dialogRef.afterClosed().subscribe((result: string | undefined) => {
          if (result === 'updated') { 
            this.loadclassid().subscribe((loaduserdata: User[]) => {
          console.warn("loaduserdata", loaduserdata);
           this.inventorydetails = loaduserdata;
           this.filteredUsers = [...loaduserdata]; 
         this.totalCount = this.inventorydetails.length;
       this.lowStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       this.highStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       });
          }
        });
   }
switchTab(userdata:string){
if(userdata=="inventory"){
  this.inventory=true;
  this.addItem=false;
  this.requests=false;
 this.activeTab = 'inventory';
 }else if(userdata=="addItem"){
  this.inventory=false;
  this.addItem=true;
  this.requests=false;
  this.activeTab = 'addItem';
 }else if(userdata=='requests'){
  this.inventory=false;
  this.addItem=false;
  this.requests=true;
    this.activeTab = 'requests';
 }
}
loadproductrequest() {
    const selectspparam = {
      spname: '[dbo].[sp_get_item_request]',
      parameter1: this.role,
      spparameter1: '@Role',
      parameter2: '',
      spparameter2: '',
    };
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
//  loadclassid() {
//     const query = `
//      SELECT ItemName,Category,Quantity,Location,Status from [dbo].[HostelInventory]
//     `;
//     console.log("query:", query);
//     let params1 = new HttpParams().set('spname', query);

//     return this.http.get<User[]>(
//       "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
//       { params: params1 }
//     );
//   }
   loadclassid() {
      let params1 = new HttpParams().set('spname', '[dbo].[sp_select_hostelinventory]');
      return this.http.get<User[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
    }
  filterUsers(): void {
  const term = this.searchTerm?.toLowerCase() || '';
  this.filteredUsers = this.inventorydetails.filter(user =>
    (user.ItemName || '').toLowerCase().includes(term) ||
    (user.Category || '').toLowerCase().includes(term) ||
    (user.Location || '').toLowerCase().includes(term) ||
    (user.Status || '').toLowerCase().includes(term)
  );
  console.log("Filtered:", this.filteredUsers);
}
// viewrequests(): void {
// const tableBody = [
//   [
//     { text: "ItemName", style: "tableHeader" },
//     { text: "Category", style: "tableHeader" },
//     { text: "Quantity", style: "tableHeader" },
//     { text: "Status", style: "tableHeader" },
//   ],
//   ...this.processrequestdata.map(item => [
//     item.ItemName || 'N/A',
//     item.Category || 'N/A',
//     item.Quantity || 'N/A',
//     item.Status || 'N/A'
//   ])
// ];

// const docDefinition: any = {
//   content: [
//     { text: "📊 Student Performance Report", style: "header" },
//     { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader" },
//     { text: "\n" },
//     {
//       table: {
//         headerRows: 1,
//         widths: ["*", "*", "auto", "auto"],  // 4 columns now
//         body: tableBody
//       },
//       layout: {
//         fillColor: (rowIndex: number) => (rowIndex === 0 ? "#4a90e2" : rowIndex % 2 === 0 ? "#f2f2f2" : null),
//         hLineColor: () => "#aaa",
//         vLineColor: () => "#aaa"
//       }
//     }
//   ],
//   styles: {
//     header: {
//       fontSize: 18,
//       bold: true,
//       alignment: "center",
//       margin: [0, 0, 0, 10]
//     },
//     subheader: {
//       fontSize: 10,
//       italics: true,
//       alignment: "right",
//       margin: [0, 0, 0, 10]
//     },
//     tableHeader: {
//       bold: true,
//       fontSize: 12,
//       color: "white",
//       fillColor: "#4a90e2",
//       alignment: "center"
//     }
//   },
//   defaultStyle: {
//     fontSize: 10
//   }
// };

// pdfMake.createPdf(docDefinition).open();
// // opens in new tab

// }
generateReport(): void {
  const tableBody = [
  [
    { text: "ItemName", style: "tableHeader" },
    { text: "Category", style: "tableHeader" },
    { text: "Quantity", style: "tableHeader" },
    { text: "Status", style: "tableHeader" },
  ],
  ...this.inventorydetails.map(item => [
    item.ItemName || 'N/A',
    item.Category || 'N/A',
    item.Quantity || 'N/A',
    item.Status || 'N/A'
  ])
];

const docDefinition: any = {
  content: [
    { text: "📊 Student Performance Report", style: "header" },
    { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader" },
    { text: "\n" },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "auto", "auto"],  // 4 columns now
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

pdfMake.createPdf(docDefinition).open();
}
exportData(): void {
  console.log("💾 Exporting performance data...");

  if (!this.inventorydetails || !this.inventorydetails.length) {
    console.warn("⚠️ No performance data available.");
    alert("No performance data to export.");
    return;
  }

  // Convert subjectData to worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.inventorydetails);

  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Performance Data");

  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });

  saveAs(blob, "performance_data.xlsx");
  console.log("✅ Data export complete");
}

ngOnInit(){
   let rawUserData = this.userDataService.getUserData();
  //   this.role = (rawUserData[0].RoleName || '').toLowerCase();
   if (typeof rawUserData === 'string') {
      try {
        rawUserData = JSON.parse(rawUserData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        rawUserData = [];
      }
    }

    if (Array.isArray(rawUserData) && rawUserData.length > 0) {
      this.reportuserid = rawUserData[0].UserID || null;
      this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
      this.role = (rawUserData[0].RoleName || '').toLowerCase();
      this.loadclassid().subscribe((loaduserdata: User[]) => {
      console.warn("loaduserdata", loaduserdata);
           this.inventorydetails = loaduserdata;
       this.filteredUsers = [...loaduserdata]; 
      this.totalCount = this.inventorydetails.length;
       this.lowStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;
       this.highStockCount = this.inventorydetails.filter(item => item.Status === 'Low Stock').length;

        if(this.inventorydetails.length > 0) {
    let lowestQuantityItem = this.inventorydetails.reduce((prev, curr) => {
      return (prev.Quantity < curr.Quantity) ? prev : curr;
    });
    
    // Now you have the item with the lowest quantity
    console.log('Lowest quantity item:', lowestQuantityItem);
    this.lowestQuantityItemName = lowestQuantityItem.ItemName; // or whatever the property name is
  }
       });
      this.loadproductrequest().subscribe((productrequestdata: any) => {
      console.warn("productrequestdata", productrequestdata);
      this.processrequestdata = productrequestdata;
      this.processrequestdata = JSON.parse(this.processrequestdata);
       this.pedningrequests= this.processrequestdata.length;
       });
    }
   
}


}
interface User {
  ItemName: string;
  Category: string;
  Quantity: string;
  Location: string;
  Status: string;
  // Add more fields if your API returns them
}