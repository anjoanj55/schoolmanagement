import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserDataService } from '../services/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

interface TimetableEntry {
  day: string;
  periodnumber: number;
  subject_name: string;
  first_name: string;
  last_name: string;
  starttime: string;
  endtime: string;
}

@Component({
  selector: 'app-records',
    standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})


export class RecordsComponent {
Weekly:boolean=true;
Daily:boolean=false;
Grade:boolean=false;
summaryData: any = [];
weekData: TimetableEntry[] = [];
timetable: { [period: number]: { [day: string]: TimetableEntry } } = {};
dailyData: TimetableEntry[] = [];
timetable1: { [period: number]: { [day: string]: TimetableEntry } } = {};
gradeData: TimetableEntry[] = [];
timetable2: { [period: number]: { [day: string]: TimetableEntry } } = {};
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
reportusername: string = ''; 
  reportrole: string = '';  

 constructor(
    private http: HttpClient,
    private router: Router,
    private userDataService: UserDataService,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
     let rawUserData = this.userDataService.getUserData();
     console.log('Raw userData for report:', rawUserData);
    // If it's a string, parse it
  if (typeof rawUserData === 'string') {
    try {
      rawUserData = JSON.parse(rawUserData);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      rawUserData = [];
    }
  }

  // ✅ Store as lowercase
  if (Array.isArray(rawUserData) && rawUserData.length > 0) {
    this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
    this.reportrole = (rawUserData[0].RoleName || '').toLowerCase();
  }

  console.log('Report Username:', this.reportusername);
  console.log('Report Role:', this.reportrole);



  if (this.reportusername && this.reportrole) {
    this.loadweek().subscribe({
      next: (res: string) => {
        try {
          this.weekData = JSON.parse(res);
          console.log("✅ Parsed weekData:", this.weekData);

          // Group by periodnumber and day
          this.timetable = this.groupByPeriodAndDay(this.weekData);
        } catch {
          console.error("❌ Not valid JSON. Raw response:", res);
          this.weekData = [];
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.weekData = [];
      }
    });
  }


  if (this.reportusername && this.reportrole) {
    this.loaddaily().subscribe({
      next: (res: string) => {
        try {
          this.dailyData = JSON.parse(res);
          console.log("✅ Parsed dailydata:", this.dailyData);

          // Group by periodnumber and day
          this.timetable1 = this.groupByPeriodAndDay(this.dailyData);
        } catch {
          console.error("❌ Not valid JSON. Raw response:", res);
          this.dailyData = [];
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.weekData = [];
      }
    });
  }

  if (this.reportusername && this.reportrole) {
    this.loadgrade().subscribe({
      next: (res: string) => {
        try {
          this.gradeData = JSON.parse(res);
          console.log("✅ Parsed gradedata:", this.gradeData);

          // Group by periodnumber and day
          this.timetable2 = this.groupByPeriodAndDay(this.gradeData);
        } catch {
          console.error("❌ Not valid JSON. Raw response:", res);
          this.gradeData = [];
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.weekData = [];
      }
    });
  }

 if (this.reportusername && this.reportrole) {
  this.loadsummary().subscribe({
    next: (res: string) => {
      try {
        const parsed = JSON.parse(res);
        this.summaryData = parsed[0]; 
        console.log('Parsed summaryData:', this.summaryData);
      } catch (e) {
        console.error('Failed to parse stats:', e);
      }
    },
    error: (err) => {
      console.error('API Error:', err);
    },
  });
  }


    
  }  

groupByPeriodAndDay(data: TimetableEntry[]) {
  const grouped: { [period: number]: { [day: string]: TimetableEntry } } = {};

  data.forEach(item => {
    const period = item.periodnumber;
    if (!grouped[period]) grouped[period] = {};
    grouped[period][item.day] = item;
  });

  return grouped;
}




switchTab(data:string){
 if(data=="Weekly"){
  this.Weekly=true;
  this.Daily=false;
  this.Grade=false;
 }else if(data=="daily"){
  this.Weekly=false;
  this.Daily=true;
  this.Grade=false;
 }else if(data=="grade"){
  this.Weekly=false;
  this.Daily=false;
  this.Grade=true;
 }
}
 loadweek() {
  const selectspparam = {
    spname: "sp_getTimetable",
    parameter1: this.reportrole,
    spparameter1: "@rolename",
    parameter2: "",
    spparameter2: ""
  };
  console.log("Request payload:", selectspparam);

  return this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
    selectspparam,
    { responseType: 'text' } // still text, since backend may not return JSON
  );
}

 loaddaily() {
  const selectspparam = {
    spname: "sp_getdailyTimetable",
    parameter1: this.reportrole,
    spparameter1: "@rolename",
    parameter2: "",
    spparameter2: ""
  };
  console.log("Request payload:", selectspparam);

  return this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
    selectspparam,
    { responseType: 'text' } // still text, since backend may not return JSON
  );
}

 loadgrade() {
  const selectspparam = {
    spname: "sp_getbygrade_timetable",
    parameter1: this.reportrole,
    spparameter1: "@rolename",
    parameter2: "",
    spparameter2: ""
  };
  console.log("Request payload:", selectspparam);

  return this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
    selectspparam,
    { responseType: 'text' } // still text, since backend may not return JSON
  );
}

 loadsummary() {
  const selectspparam = {
    spname: "[dbo].[sp_getTimetable_detail]",
    parameter1: this.reportrole,
    spparameter1: "@rolename",
    parameter2: "",
    spparameter2: ""
  };
  console.log("Request payload:", selectspparam);

  return this.http.post(
    'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
    selectspparam,
    { responseType: 'text' } // still text, since backend may not return JSON
  );
}


}
