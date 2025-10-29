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
import { KitManAddInventoryComponent } from '../kit-man-add-inventory/kit-man-add-inventory.component';
import { MealOrdAddFdbckComponent } from '../meal-ord-add-fdbck/meal-ord-add-fdbck.component'; 
import { KitManAddOrderComponent } from '../kit-man-add-order/kit-man-add-order.component';
import { KitmanAddmenuComponent } from '../kitman-addmenu/kitman-addmenu.component';

interface KitchenItem {
  ItemID: number;
  ItemName: string;
  Category : string;
  Quantity: number;
  Status : string;
  Unit: string;
  ReorderLevel : number;
  Supplier : string;
  PurchaseDate: string
  ExpiryDate: string;
}

interface MealOrders {
ID: number;
Name: string;
MealType: string;
MealDateTime: string;
OrderTime: string;
 Quantity: number;
 Status: string;
 Remarks: string;
 InsertedBy: string;
 InsertedDate: string;
 UpdatedBy: string;
 UpdatedDate: string;
 
}

interface MenuPlanning {
ID: number;
DayOfWeek: string;
Meal: string;
Type: string;
Ingredients: string;
Comment: string;
UpdatedBy: string;
UpdatedDate: string;
InsertedBy: string;
InsertedDate: string;
}

interface MealFeedback {
FeedbackID: number;
Meal: string;
Rating: string;
Comments: string;
Suggestions: string;
SubmittedBy: string;
SubmittedDate: string;
UpdatedBy: string;
UpdatedDate: string;
}

@Component({
  selector: 'app-kitchen-management',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,  // << add this
    MatDialogModule
  ],
  templateUrl: './kitchen-management.component.html',
  styleUrls: ['./kitchen-management.component.css']
})
export class KitchenManagementComponent implements OnInit {

  KitchenInventory : KitchenItem[] = [];
  KitchenInventoryfil: KitchenItem[] = [];
  KitchenInventorySearchTerm: string = '';
  filteredKitchenInventory: KitchenItem[] = [];

  MealOrders :MealOrders[] = [];
  MealOrdersfil :MealOrders[] = [];
  MealOrdersSearchTerm: string = '';

  MenuPlanning :MenuPlanning[] = [];
  MenuPlanningfil :MenuPlanning[] = [];
  MenuPlanningSearchTerm: string = '';

  MealFeedback :MealFeedback[] = [];
  MealFeedbackfil :MealFeedback[] = [];
  MealFeedbackSearchTerm: string = '';

 inventory:boolean=true;
 orders:boolean=false;
  feed:boolean=false;
  mp:boolean=false;
 activeTab: string = 'inventory'; 
 
  constructor(private http: HttpClient, private dialog: MatDialog) {}
switchTab(userdata:string){
if(userdata=="inventory"){
  this.inventory=true;
  this.orders=false;
  this.feed=false;
  this.mp=false;
 this.activeTab = 'inventory';}
 else if(userdata=="orders"){
  this.inventory=false;
  this.orders=true;
  this.feed=false;
  this.mp=false; 
  this.activeTab = 'orders';}
   else if(userdata=="feed"){
  this.inventory=false;
  this.orders=false;
  this.feed=true;
  this.mp=false; 
  this.activeTab = 'feed';}
   else if(userdata=="mp"){
  this.inventory=false;
  this.orders=false;
  this.feed=false;
  this.mp=true; 
  this.activeTab = 'mp';}
}
ngOnInit(): void {
  this.loadKitchenInventory().subscribe((KitchenItem: any) => {
    console.log("API Raw Response:", KitchenItem);
    this.KitchenInventory = KitchenItem;
    this.KitchenInventoryfil = KitchenItem;
     // assign the full array
    console.warn("KitchenInventory", this.KitchenInventory);
  });

    this.loadMealOrders().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MealOrders = res; 
    this.MealOrdersfil = res; // assign the full array
    console.warn("MealOrders", this.MealOrders);
  });

    this.loadMenuPlanning().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MenuPlanning = res; 
    this.MenuPlanningfil = res;// assign the full array
    console.warn("MenuPlanning", this.MenuPlanning);
  });

    this.loadMealFeedback().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MealFeedback = res;
    this.MealFeedbackfil = res; // assign the full array
    console.warn("MealFeedback", this.MealFeedback);
  });

}

  loadKitchenInventory() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_select_KitchenInventory]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

    loadMealOrders() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_select_MealOrders]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

      loadMenuPlanning() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_MenuPlanning]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

      loadMealFeedback() {
    let params1 = new HttpParams().set(
      'spname', '[dbo].[sp_Select_MealFeedback]'
    );
    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }


  filterTable() {
    const term = this.KitchenInventorySearchTerm.toLowerCase();
    this.KitchenInventory = this.KitchenInventoryfil.filter((item: KitchenItem) =>
      item.ItemName.toLowerCase().includes(term) ||
      item.Category?.toLowerCase().includes(term) 
      // item.Location?.toLowerCase().includes(term) 
      // item.Status?.toLowerCase().includes(term)
    );
  }

    filterMealOrders() {
    const term = this.MealOrdersSearchTerm.toLowerCase();
    this.MealOrders = this.MealOrdersfil.filter((item: MealOrders) =>
      item.Name.toLowerCase().includes(term) ||
      item.MealType?.toLowerCase().includes(term) 
    );
  }

    filterMenuPlanning() {
    const term = this.MenuPlanningSearchTerm.toLowerCase();
    this.MenuPlanning = this.MenuPlanningfil.filter((item: MenuPlanning) =>
      item.DayOfWeek.toLowerCase().includes(term) ||
      item.Meal?.toLowerCase().includes(term) ||
      item.Type?.toLowerCase().includes(term) 
      // item.Status?.toLowerCase().includes(term)
    );
  }

    filterFeedback() {
    const term = this.MealFeedbackSearchTerm.toLowerCase();
    this.MealFeedback = this.MealFeedbackfil.filter((item: MealFeedback) =>
      item.Meal.toLowerCase().includes(term) ||
      String(item.Rating)?.toLowerCase().includes(term) ||
      item.Comments.toLowerCase().includes(term) ||
      item.Suggestions.toLowerCase().includes(term) ||
      item.SubmittedBy.toLowerCase().includes(term)
    );
  }


  exportKitchenInventorydata(): void {
    console.log("💾 Exporting Kitchen Inventory data...");
   
    if (!this.KitchenInventory || !this.KitchenInventory.length) {
      console.warn("⚠️ No Kitchen Inventory data available.");
      alert("No Kitchen Inventory data to export.");
      return;
    }
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.KitchenInventory);
   
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kitchen Inventory Data");
   
    // Write workbook
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
   
    saveAs(blob, "KitchenInventory_data.xlsx");
    console.log("✅ Data export complete");
  }

  
    exportMealOrderdata(): void {
    console.log("💾 Exporting Meal Orders data...");
   
    if (!this.MealOrders || !this.MealOrders.length) {
      console.warn("⚠️ No Meal Orders data available.");
      alert("No Meal Orders data to export.");
      return;
    }
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MealOrders);
   
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Meal Orders Data");
   
    // Write workbook
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
   
    saveAs(blob, "MealOrders_data.xlsx");
    console.log("✅ Data export complete");
  }

      exportMenuPlanningdata(): void {
    console.log("💾 Exporting Menu Planning data...");
   
    if (!this.MenuPlanning || !this.MenuPlanning.length) {
      console.warn("⚠️ No Menu Planning data available.");
      alert("No Menu Planning data to export.");
      return;
    }
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MenuPlanning);
   
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu Planning Data");
   
    // Write workbook
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
   
    saveAs(blob, "MenuPlanning_data.xlsx");
    console.log("✅ Data export complete");
  }

   exportKitManFeedbackdata(): void {
    console.log("💾 Exporting Menu Planning data...");
   
    if (!this.MealFeedback || !this.MealFeedback.length) {
      console.warn("⚠️ No Meal Feedback data available.");
      alert("No Meal Feedback data to export.");
      return;
    }
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MealFeedback);
   
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Meal Feedback Data");
   
    // Write workbook
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
   
    saveAs(blob, "MealFeedback_data.xlsx");
    console.log("✅ Data export complete");
  }

      openAddInventory() {
     console.log('Opening dialog with subject:');
      const dialogRef = this.dialog.open(KitManAddInventoryComponent, {
        width: '450px',
        height: '100vh',    
        position: { right: '0px', top: '0px' },
        panelClass: 'custom-dialog-container'
      });
   dialogRef.afterClosed().subscribe((result) => {
    if (result === 'added' || result === true) {
      console.log('added call')// call your function to refresh data
      this.loadKitchenInventory().subscribe((KitchenItem: any) => {
    console.log("API Raw Response:", KitchenItem);
    this.KitchenInventory = KitchenItem;
    this.KitchenInventoryfil = KitchenItem;
     // assign the full array
    console.warn("KitchenInventory", this.KitchenInventory);
  });
    }
  });
    }

     openEditInventory(KitchenItem :any) {
     console.log('Opening dialog with subject:');
      const dialogRef = this.dialog.open(KitManAddInventoryComponent, {
    width: '450px',
    height: '100vh',
    position: { right: '0px', top: '0px' },
    panelClass: 'custom-dialog-container',
    data: KitchenItem || null
  });

   dialogRef.afterClosed().subscribe((result) => {
    if (result === 'updated' || result === true) {
      console.log('updated call')// call your function to refresh data
      this.loadKitchenInventory().subscribe((KitchenItem: any) => {
    console.log("API Raw Response:", KitchenItem);
    this.KitchenInventory = KitchenItem;
    this.KitchenInventoryfil = KitchenItem;
     // assign the full array
    console.warn("KitchenInventory", this.KitchenInventory);
  });
    }
  });
    }

  
      openMOAddFeedback() {
     console.log('Opening dialog with subject:');
      this.dialog.open(MealOrdAddFdbckComponent, {
        width: '450px',
        height: '100vh',    
        position: { right: '0px', top: '0px' },
        panelClass: 'custom-dialog-container'
      });
    }

      openAddOrder() {
     console.log('Opening dialog with subject:');
      const dialogRef = this.dialog.open(KitManAddOrderComponent, {
        width: '450px',
        height: '100vh',    
        position: { right: '0px', top: '0px' },
        panelClass: 'custom-dialog-container'
      });
       dialogRef.afterClosed().subscribe((result) => {
    if (result === 'added' || result === true) { 
    this.loadMealOrders().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MealOrders = res; 
    this.MealOrdersfil = res; // assign the full array
    console.warn("MealOrders", this.MealOrders);
  });      
    }
  });
    }
    

      openEditOrder(MealOrders:any) {
     console.log('Opening dialog with subject:');
  const dialogRef = this.dialog.open(KitManAddOrderComponent, {
    width: '450px',
    height: '100vh',
    position: { right: '0px', top: '0px' },
    panelClass: 'custom-dialog-container',
    data: MealOrders || null
  });

       dialogRef.afterClosed().subscribe((result) => {
    if (result === 'updated' || result === true) { 
    this.loadMealOrders().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MealOrders = res; 
    this.MealOrdersfil = res; // assign the full array
    console.warn("MealOrders", this.MealOrders);
  });      
    }
  });
    }

    openAddMenu() {
     console.log('Opening dialog with subject:');
    const dialogRef = this.dialog.open(KitmanAddmenuComponent, {
        width: '450px',
        height: '100vh',    
        position: { right: '0px', top: '0px' },
        panelClass: 'custom-dialog-container'
      });
        dialogRef.afterClosed().subscribe((result) => { 
    if (result == 'added' || result == true) {
      console.log('added call')
    this.loadMenuPlanning().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MenuPlanning = res; 
    this.MenuPlanningfil = res;// assign the full array
    console.warn("MenuPlanning", this.MenuPlanning);
  });
} 
  });
    }
    
      openEditMenu(MenuPlanning:any) {
     console.log('Opening dialog with subject:');
    const dialogRef = this.dialog.open(KitmanAddmenuComponent, {
        width: '450px',
        height: '100vh',    
        position: { right: '0px', top: '0px' },
        panelClass: 'custom-dialog-container',
        data: MenuPlanning
      });
        dialogRef.afterClosed().subscribe((result) => { 
    if (result === 'updated' || result === true) {
      console.log('updated call')// call your function to refresh data
    this.loadMenuPlanning().subscribe((res: any) => {
    console.log("API Raw Response:", res);
    this.MenuPlanning = res; 
    this.MenuPlanningfil = res;// assign the full array
    console.warn("MenuPlanning", this.MenuPlanning);
  });
} 
  });
    }
    

}
