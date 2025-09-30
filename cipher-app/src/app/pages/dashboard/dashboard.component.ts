import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
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
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  
  reportusername: string | null = null;
  reportrole: string | null = null;
  statsData: any = [];
  coreData:  Subject[] = [];
  filteredcoreData: Subject[] = [];
  electData: Subject[] = []; // Original data from API
  filteredElectData: Subject[] = []; // Filtered data to display
  subjectData: Subject[] = [];
  allsubjectdatafiltered: Subject[] = [];
  searchTerm: string = '';
  recenttData: any = [];
  filterData: any = [];
  reportuserid: number | null = null;
  classid: number | null = null;

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

        // If API returns an array
        if (Array.isArray(res) && res.length > 0) {
          this.classid = res[0].class_id;   // ✅ use class_id
        } else if (res?.class_id) {
          this.classid = res.class_id;
        } else {
          this.classid = null;
        }

        console.warn("resolved classid:", this.classid);

        // ✅ Now only call filter details once classid is ready
        if (this.classid) {
          this.loadfilterdetails().subscribe({
            next: (res: string) => {
              try {
                this.filterData = JSON.parse(res);
                console.log("✅ Parsed filterData:", this.filterData);
              } catch {
                console.error("❌ Not valid JSON. Raw response:", res);
                this.filterData = [];
              }
            },
            error: (err) => {
              console.error("API Error:", err);
              this.filterData = [];
            }
          });
        }
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

  

  // ---------------- API CALLS ----------------

   filterSubjects() {
    const term = this.searchTerm.toLowerCase();
    this.filteredElectData = this.electData.filter(subject =>
      subject.subject_name.toLowerCase().includes(term) ||
      subject.first_name.toLowerCase().includes(term) ||
      subject.last_name.toLowerCase().includes(term) ||
      subject.class_names.toLowerCase().includes(term)
    );

  }
   filtercore() {
    const term = this.searchTerm.toLowerCase();
    this.filteredcoreData = this.coreData.filter(subject =>
      subject.subject_name.toLowerCase().includes(term) ||
      subject.first_name.toLowerCase().includes(term) ||
      subject.last_name.toLowerCase().includes(term) ||
      subject.class_names.toLowerCase().includes(term)
    );
    
  }
  

  filterallsub() {
    const term = this.searchTerm.toLowerCase();
    this.allsubjectdatafiltered = this.subjectData.filter(subject =>
      subject.subject_name.toLowerCase().includes(term) ||
      subject.first_name.toLowerCase().includes(term) ||
      subject.last_name.toLowerCase().includes(term) ||
      subject.class_names.toLowerCase().includes(term)
    );
    
  }


  loadclassid() {
    const query = `
      select distinct c.class_id 
      from students s 
      left join Classes c on s.class_id = c.class_id
      where student_id = ${this.reportuserid}
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
