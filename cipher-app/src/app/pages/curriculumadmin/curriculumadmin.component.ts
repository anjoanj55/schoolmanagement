import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UserDataService } from '../services/user-data.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SubjectdetailComponent } from '../subjectdetail/subjectdetail.component';
import { MatDialog } from '@angular/material/dialog';
import { AddsubjectComponent } from '../addsubject/addsubject.component';
import { FormsModule } from '@angular/forms'; 
interface Subject {
  subject_name: string;
  subject_code: string;
  class_names: string;
  total_hours_per_week: number;
  first_name: string;
  last_name: string;
  studentcount: number;
}
@Component({
  selector: 'app-curriculumadmin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './curriculumadmin.component.html',
  styleUrl: './curriculumadmin.component.css'
})
export class CurriculumadminComponent implements OnInit {
  
  reportusername: string | null = null;
  reportrole: string | null = null;
  statsData: any = [];
  coreData:  Subject[] = [];
  filteredcoreData: Subject[] = [];
  electData: Subject[] = []; // Original data from API
  filteredElectData: Subject[] = []; // Filtered data to display
  subjectData: Subject[] = [];
  allsubjectdatafiltered: Subject[] = [];
  filterSubjectData: any[] = [];
  recenttData: any = [];
  filterData: any = [];
  reportuserid: number | null = null;
  classid: number | null = null;
  searchTerm: string = '';
  selectedClassId: any = null;
  classList: any[] = [];
  alltab: boolean = true;
  core: boolean = false;
  choose: boolean = false;
  advanced: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userDataService: UserDataService,
    private dialog: MatDialog
  ) {}

  switchTab(data: string) {
    this.searchTerm = '';
    this.alltab = (data === 'all');
    this.core = (data === 'core');
    this.choose = (data === 'elective');
    this.advanced = false;
  }

  openDetails(subject: any) {
    this.dialog.open(SubjectdetailComponent, {
      width: '450px',
      height: '100vh',     // full height
      position: { right: '0px', top: '0px' }, // align to right
      data: subject,
      panelClass: 'custom-dialog-container'
    });
  }

  // openAddSubject() {
  //   this.dialog.open(AddsubjectComponent, {
  //     width: '450px',
  //     height: '100vh',
  //     position: { right: '0px', top: '0px' },
  //     disableClose: true, 
  //     panelClass: 'custom-dialog-container'
  //   });
  // }
 openAddSubject(subjectData?: any) {
  console.log("Opening AddSubject dialog");
  console.log("Subject data passed:", subjectData);

  const dialogRef = this.dialog.open(AddsubjectComponent, {
    width: '450px',
    height: '100vh',
    position: { right: '0px', top: '0px' },
    disableClose: true,
    panelClass: 'custom-dialog-container',
    data: subjectData || null  // pass the data if editing, else null
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result === 'updated') {
      this.loadsubjectdetails();  // reload the subjects after update
    }
  });
}

  ngOnInit(): void {
    let rawUserData = this.userDataService.getUserData();
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
      this.reportuserid = rawUserData[0].UserID || null;
      this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
      this.reportrole = (rawUserData[0].RoleName || '').toLowerCase();
    }

    console.log('Report UserID:', this.reportuserid);
    console.log('Report Username:', this.reportusername);
    console.log('Report Role:', this.reportrole);

    // ✅ Load curriculum summary
    if (this.reportusername && this.reportrole) {
      this.loaduserdetails().subscribe({
        next: (res: string) => {
          try {
            this.statsData = JSON.parse(res);
            console.log('Parsed stats data:', this.statsData);
          } catch {
            console.error('Failed to parse stats:', res);
          }
        },
        error: (err) => console.error('API Error:', err),
      });

      // ✅ Load subject details
      this.loadsubjectdetails().subscribe({
        next: (res: string) => {
          try {
            this.subjectData = JSON.parse(res);
            console.log("✅ Parsed subject data:", this.subjectData);
            this.allsubjectdatafiltered=this.subjectData;
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.subjectData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.subjectData = [];
        }
      });

      // ✅ Load recent activity
      this.loadrecent().subscribe({
        next: (res: string) => {
          try {
            this.recenttData = JSON.parse(res);
            console.log("✅ Parsed recenttData:", this.recenttData);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.recenttData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.recenttData = [];
        }
      });

      // ✅ Load classid, then filter details
       this.loadclassid().subscribe((res: any) => {
    console.warn("classid query result:", res);

    this.classList = res; // Example: [{class_id: 1, class_name: "Class 1"}...]
  });


      this.loadcoredetails().subscribe({
        next: (res: string) => {
          try {
            this.coreData = JSON.parse(res);
            console.log("✅ Parsed CoreData:", this.coreData);
            this.filteredcoreData = this.coreData;
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.coreData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.coreData = [];
        }
      });


      this.loadelectivedetails().subscribe({
        next: (res: string) => {
          try {
            this.electData = JSON.parse(res);
            console.log("✅ Parsed CoreData:", this.electData);

             this.filteredElectData = this.electData;
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.electData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.electData = [];
        }
      });



    }
  }

    exportData() {
    if (!this.subjectData || this.subjectData.length === 0) {
      alert("No subject data to export!");
      return;
    }
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.subjectData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subjects");
  
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Export CurriculumData.xlsx');
  }
    expoData() {
    if (!this.subjectData || this.subjectData.length === 0) {
      alert("No subject data to export!");
      return;
    }
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.subjectData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subjects");
  
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Data.xlsx');
  }

   onClassChange() {
  this.classid = this.selectedClassId;
  console.log("Selected class ID:", this.classid);

  if (!this.classid) {
    console.warn("No class selected!");
    return;
  }

  this.loadfilterdetails().subscribe({
    next: (res: any) => {
      try {
        const parsed = JSON.parse(res);
        console.log(" Parsed summary filter data:", parsed);
        this.statsData = parsed;   // update bound data
      } catch {
        console.warn(" Summary response is not JSON:", res);
        this.statsData = [];
      }
    },
    error: (err) => console.error("Error in loadfilterdetails:", err)
  });

  this.loadfilterdetailsfilter().subscribe({
    next: (res: any) => {
      try {
        const parsed = JSON.parse(res);
        console.log(" Parsed detailed filter data:", parsed);
        this.allsubjectdatafiltered = parsed;
        this.filterSubjectData = parsed;
        this.filteredcoreData = parsed;
        this.filteredElectData = parsed;   // update bound data
      } catch {
        console.warn(" Detail response is not JSON:", res);
        this.subjectData = [];
        this.coreData = [];
        this.electData = [];
      }
    },
    error: (err) => console.error("Error in loadfilterdetailsfilter:", err)
  });


  



}

  

  // ---------------- API CALLS ----------------

  filterSubjects() {
    const term = this.searchTerm.toLowerCase();
    
    let baseData = this.filterSubjectData.length > 0 
    ? this.filterSubjectData    // use second load if present
    : this.electData;         // fallback to first load

    this.filteredElectData =  baseData.filter(subject =>
     subject.subject_name?.toLowerCase().includes(term) ||
    subject.first_name?.toLowerCase().includes(term) ||
    subject.last_name?.toLowerCase().includes(term) ||
    subject.class_names?.toLowerCase().includes(term)
    );

  }
   filtercore() {
    const term = this.searchTerm.toLowerCase();

      let baseData = this.filterSubjectData.length > 0 
    ? this.filterSubjectData    // use second load if present
    : this.coreData;         // fallback to first load

    this.filteredcoreData = baseData.filter(subject =>
     subject.subject_name?.toLowerCase().includes(term) ||
    subject.first_name?.toLowerCase().includes(term) ||
    subject.last_name?.toLowerCase().includes(term) ||
    subject.class_names?.toLowerCase().includes(term)
    );
    
  }
  
  filterallsub() {
  const term = this.searchTerm.toLowerCase();

  // decide which dataset you want to filter (first or second load)
  let baseData = this.filterSubjectData.length > 0 
    ? this.filterSubjectData    // use second load if present
    : this.subjectData;         // fallback to first load

  this.allsubjectdatafiltered = baseData.filter(subject =>
    subject.subject_name?.toLowerCase().includes(term) ||
    subject.first_name?.toLowerCase().includes(term) ||
    subject.last_name?.toLowerCase().includes(term) ||
    subject.class_names?.toLowerCase().includes(term)
  );
}

  // filterallsub() {
  //   const term = this.searchTerm.toLowerCase();
  //   this.allsubjectdatafiltered = this.subjectData.filter(subject =>
  //     subject.subject_name.toLowerCase().includes(term) ||
  //     subject.first_name.toLowerCase().includes(term) ||
  //     subject.last_name.toLowerCase().includes(term) ||
  //     subject.class_names.toLowerCase().includes(term)
  //   );
    
  // }

  loadfilterdetailsfilter() {
  const selectspparam = {
    spname: '[dbo].[sp_loadcuriculumdetail_filtered_get]',
    parameter1: this.reportrole,
    spparameter1: '@loginType',
    parameter2: this.classid,  // 👈 selected classid will be passed here
    spparameter2: '@classid',
  };
  console.log("selectspparam filter", selectspparam);

  return this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
    selectspparam,
    { responseType: 'text' }
  );
}
  

 loadclassid() {
    const query = `
     select distinct cast(class_name as int )class_name from Classes order by cast(class_name as int )
    `;
    console.log("query:", query);
    let params1 = new HttpParams().set('spname', query);

    return this.http.get(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    );
  }

  loaduserdetails() {
    const selectspparam = {
      spname: 'sp_loadcuriculumsummary_get',
      parameter1: this.reportrole,
      spparameter1: '@loginType',
      parameter2: this.reportuserid,
      spparameter2: '@parentid',
    };
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }

  loadsubjectdetails() {
    const selectspparam = {
      spname: "sp_loadcuriculumdetail_get",
      parameter1: this.reportrole,
      spparameter1: "@role",
      parameter2: this.reportuserid,
      spparameter2: "@parentid"
    };
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }



  loadrecent() {
    const selectspparam = {
      spname: "sp_loadrecentactivity_get",
      parameter1: this.reportrole,
      spparameter1: "@rolename",
      parameter2: "",
      spparameter2: ""
    };
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }

  loadfilterdetails() {
    const selectspparam = {
      spname: '[dbo].[sp_loadcuriculumsummaryfilterd_get]',
      parameter1: this.reportrole,
      spparameter1: '@loginType',
      parameter2: this.classid,
      spparameter2: '@classid',
    };
    console.log("selectspparam filter", selectspparam);
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
  loadcoredetails() {
    const selectspparam = {
      spname: '[dbo].[sp_loadcuriculumdetail_get]',
      parameter1: this.reportrole,
      spparameter1: '@role',
      parameter2: this.reportuserid,
      spparameter2: "@parentid",
      parameter3: 'Core',
      spparameter3: '@SubjectType',
      parameter4: '',
      spparameter4: '',
      parameter5: '',
      spparameter5: '',
      parameter6: '',
      spparameter6: '',
    };
    console.log("selectspparam filter", selectspparam);
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/MultipleSelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
  clearSearch() {
  this.searchTerm = '';
  
}

  loadelectivedetails() {
    const selectspparam = {
      spname: '[dbo].[sp_loadcuriculumdetail_get]',
      parameter1: this.reportrole,
      spparameter1: '@role',
      parameter2: this.reportuserid,
      spparameter2: "@parentid",
      parameter3: 'Elective',
      spparameter3: '@SubjectType',
      parameter4: '',
      spparameter4: '',
      parameter5: '',
      spparameter5: '',
      parameter6: '',
      spparameter6: '',
    };
    console.log("selectspparam filter", selectspparam);
    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/MultipleSelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }

  
}
