import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TrackingDetailDialogComponent } from '../tracking-detail-dialog/tracking-detail-dialog.component';
import { DetailProfileDialogComponent } from '../detail-profile-dialog/detail-profile-dialog.component';
import {TrackingHistoryComponent} from '../tracking-history/tracking-history.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


interface Person {
  id: number;
  Name: string;
  Gender?: string;
  Age?: number;
  Category?: string;
  JoinDate?: Date;
  Photo?: string;
}

interface Category {
  CategoryName: string;
}

@Component({
  selector: 'app-track-person',
  standalone: true,
  templateUrl: './track-person.component.html',
  styleUrls: ['./track-person.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    MatSnackBarModule
  ]
})
export class TrackPersonComponent implements OnInit {

  categories: Category[] = [];          
  names: Person[] = [];                 

  selectedCategory: string | null = null;
  selectedName: string | null = null;

  searchName: string = '';

  startDate: string = "";
  start_Date: Date | null = null;
  endDate: string = "";
  end_Date: Date | null = null;


  allPeople: any[] = [];                
  displayedPeople: any[] = []; 
  selectedPerson: any;  

  displayedColumns: string[] = [
    'photo',
    'name',
    'gender',
    'age',
    'detailProfile',
    'trackingDetails'
    // 'stopTracking'
  ];

  constructor(private dialog: MatDialog, private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loaduser().subscribe((loaduserdata: any) => {
      console.warn("track data", loaduserdata);
      this.allPeople = loaduserdata;
      this.displayedPeople = [...this.allPeople];
    });

    this.loadcategory().subscribe((loadcategorydata: Category[]) => {
      console.warn("Category data", loadcategorydata);
      this.categories = loadcategorydata;
    });
  }

  // ===== API CALLS =====
  loaduser() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_PersonsList]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 });
  }

  loadcategory() {
    let params1 = new HttpParams().set('spname', 'select CategoryName from Category');
    return this.http.get<Category[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loadNamesByCategory() {
    const selectspparam = {
      spname: "dbo.sp_Select_NamesWithCategory",
      parameter1: this.selectedCategory,
      spparameter1: "@Category",
      parameter2: "",
      spparameter2: ""
    };
    console.warn("names params", selectspparam);
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam,
      { responseType: 'text' }
    );
  }

  onCategoryChange(selectedCategory: string) {
    console.log("🔥 Category Change Event Triggered!");
    console.log("Selected Category (from dropdown):", selectedCategory);

    this.selectedCategory = selectedCategory; 
    console.log("Selected Category (from dropdown) real:", this.selectedCategory);
    this.selectedName = null;

    if (!selectedCategory) {
      console.log("⚠️ No category selected. Clearing names list.");
      this.names = [];
      return;
    }

    this.loadNamesByCategory().subscribe((loadnamedata: any) => {
      try {
        this.names = typeof loadnamedata === 'string' ? JSON.parse(loadnamedata) : loadnamedata;
      } catch (e) {
        console.error("❌ Failed to parse names response", e);
        this.names = [];
      }
    });
  }

  // ===== FILTERING =====
  onFiltersChanged() {
    this.filterTable();
    console.log("Selected ID:", this.selectedPerson?.id);
    console.log("Selected Name:", this.selectedPerson?.Name);
  }

  formatDate(date: Date): string {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  onStartDateChanged(date: Date) {
    this.startDate = this.formatDate(date);
    console.log("Selected Start Date:", this.startDate); 
  }

  onEndDateChanged(date: Date) {
    this.endDate = this.formatDate(date);
    console.log("Selected End Date:", this.endDate); 
  }

  filterTable() {
    this.displayedPeople = this.allPeople.filter(p =>
      (!this.selectedCategory || p.Category === this.selectedCategory) &&
      (!this.selectedName || p.Name === this.selectedName) &&
      (!this.searchName || p.Name.toLowerCase().includes(this.searchName.toLowerCase()))
    );
  }

  // ===== AUTOCOMPLETE =====
  filteredPeopleList(): Person[] {
    const filtered = this.allPeople.filter(p =>
      (!this.selectedCategory || p.Category === this.selectedCategory) &&
      (!this.searchName || p.Name.toLowerCase().includes(this.searchName.toLowerCase()))
    );
    return Array.from(new Map(filtered.map(p => [p.Name, p])).values());
  }

  onSelectName(event: MatAutocompleteSelectedEvent) {
    this.searchName = event.option.value;
    this.filterTable();
  }

  // ===== DIALOGS =====
  showDetail(person: any) {
    this.dialog.open(TrackingDetailDialogComponent, {
      width: '500px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'custom-dialog-panel',
      data: { id: person.id, category: person.Category }
    });
  }

  showDetailProfile(person: any) {
    this.dialog.open(DetailProfileDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'custom-dialog-panel',
      data: { id: person.id, category: person.Category }
    });
  }

  // ✅ Fixed onStartTracking method
onStartTracking(): void {
  if (!this.selectedPerson?.id) {
    alert("Please select a person");
    return;
  }

  if (!this.selectedCategory) {
    alert("Please select a category");
    return;
  }

  if (!this.startDate || !this.endDate) {
    alert("Please select start and end dates");
    return;
  }

  // ✅ Use EXACTLY the same structure as your working loadNamesByCategory method
  const requestData = {
    JSONFileparams: JSON.stringify([
    {
    Category: this.selectedCategory,
    id: parseInt(this.selectedPerson.id),
    StartDate: this.startDate,
    EndDate: this.endDate,
    }
  ]),
    spname: "[dbo].[sp_Insert_StartTracking]",
  };

  console.log("Request Payload:", JSON.stringify(requestData, null, 2));

  // ✅ Use the SAME endpoint as your working method
  this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC',
    requestData,
    { responseType: 'text' }
  ).subscribe({
    next: (response: any) => {
      console.log("API Response:", response);
      
      // ✅ Check for success response (might be different for insert operations)
      if (response && (response.trim().toLowerCase().includes("success") || 
                       response.includes("inserted") || 
                       response.includes("affected") ||
                       response.trim() === "1")) {
        this.snackBar.open('Tracking started successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.resetForm();
      } else {
        console.log("Unexpected response, but operation might have succeeded:", response);
        // Sometimes insert procedures return different responses
        this.snackBar.open('Operation completed. Response: ' + response, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-info']
        });
      }
    },
    error: (error: any) => {
      console.error("API Error:", error);
      alert('Error starting tracking: ' + error.message);
    }
  });
}

private resetForm(): void {
  this.selectedPerson = {};
  this.selectedCategory = '';
  this.startDate = '';
  this.endDate = '';
}
    onHistory(): void {
    this.dialog.open(TrackingHistoryComponent, {
      width: '145vh',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'custom-dialog-panel',
      // data: { id: person.id, category: person.Category }
    });
  }
clearStartDate() {
  this.start_Date = null;
  this.startDate = "";   // reset the string as well
}

clearEndDate() {
  this.end_Date = null;
  this.endDate = "";   // reset the string as well
}

  // onStopTracking(): void {
  //   alert('Stop Tracking clicked!');
  //   // Add your stop tracking logic here
  // }
}
