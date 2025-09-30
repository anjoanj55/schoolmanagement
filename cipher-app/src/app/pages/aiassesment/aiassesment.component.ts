import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserDataService } from '../../pages/services/user-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


interface Student {
  FirstName: string;
  LastName: string;
  Status: string;
  Confidence?: number;
  PredictedMarks?: number;
  Remark?: string;
  StudentId?: number;
  SubjectId?: number;
  SubjectName?: string;
}

@Component({
  selector: 'app-aiassesment',
  standalone: true,
  imports: [CommonModule,HttpClientModule,MatDialogModule],
  templateUrl: './aiassesment.component.html',
  styleUrl: './aiassesment.component.css'
})
export class AiassesmentComponent {
  reportrole: string | null = null;
  reportusername: string = '';
  reportuserid: number | null = null;
  summaryData: any = [];
  allSummary: any = [];
  topstudent: Student[] = [];
  
  constructor(private dialog: MatDialog,private http: HttpClient,private userDataService: UserDataService) {
 
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

    this.summary().subscribe({
        next: (res: string) => {
          try {
            this.summaryData = JSON.parse(res);
            console.log("✅ Parsed summaryData:", this.summaryData);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.summaryData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.summaryData = [];
        }
      });

      this.allExamSummary().subscribe({
        next: (res: string) => {
          try {
            this.allSummary = JSON.parse(res);
            console.log("✅ Parsed allSummary:", this.allSummary);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.allSummary = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.allSummary = [];
        }
      });

      this.topStudent().subscribe({
        next: (res: string) => {
          try {
            this.topstudent = JSON.parse(res);
            console.log("✅ Parsed topstudent:", this.topstudent);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.topstudent = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.topstudent = [];
        }
      });
    }
  
  
  summary() {
    const selectspparam = {
      spname: '[dbo].[Sp_Get_SubjectWiseExamSummary]',
      parameter1: this.reportrole,
      spparameter1: '@UserRole',
      parameter2: "",
      spparameter2: "",
    };

    console.log("📡 Fetching Fee Data with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
  allExamSummary() {
    const selectspparam = {
      spname: '[dbo].[Sp_Get_allExamSummary]',
      parameter1: this.reportrole,
      spparameter1: '@UserRole',
      parameter2: "",
      spparameter2: "",
    };

    console.log("📡 Fetching Fee Data with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
  topStudent() {
    const selectspparam = {
      spname: '[dbo].[Sp_Get_StudentExamPredictions]',
      parameter1: this.reportrole,
      spparameter1: '@UserRole',
      parameter2: "",
      spparameter2: "",
    };

    console.log("📡 Fetching Fee Data with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
}
