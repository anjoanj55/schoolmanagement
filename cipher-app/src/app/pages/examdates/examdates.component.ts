import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../pages/services/user-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export interface Exam {
  exam_date: string;
  start_time: string;
  end_time: string;
  exam_name: string;
  day: string;
}

@Component({
  selector: 'app-examdates',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './examdates.component.html',
  styleUrls: ['./examdates.component.css']   // ✅ corrected (plural)
})
export class ExamdatesComponent implements OnInit, AfterViewInit {
  @ViewChild('scheduleSection', { static: false }) scheduleSection!: ElementRef;

  reportusername: string = '';
  reportrole: string = '';
  reportuserid: number | null = null;
  tableData: Exam[] = [];
  searchText: string = '';


  Weekly: boolean = true;
  Daily: boolean = false;
  Grade: boolean = false;

  days: string[] = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService
  ) {}
  ngAfterViewInit() {
    console.log('Schedule section available:', !!this.scheduleSection);
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

    this.loadexam().subscribe({
      next: (res: any) => {
        try {
          const parsed: Exam[] = JSON.parse(res);
          console.log("Parsed exam data:", parsed);

          // ✅ Normalize day values
          this.tableData = parsed.map((exam: Exam) => {
            const normalizedDay = exam.day
              ? exam.day.trim().toLowerCase()
              : this.getDayFromDate(exam.exam_date); // fallback

            return {
              ...exam,
              day: this.capitalize(normalizedDay)
            };
          });

        } catch {
          console.warn("Response is not valid JSON:", res);
          this.tableData = [];
        }
      },
      error: (err) => console.error("Error in loadexam:", err)
    });
  }

  // ✅ Get exams for a specific day
  // getExamsForDay(day: string): Exam[] {
  //   return this.tableData.filter(e => e.day === day);
  // }
  getExamsForDay(day: string): Exam[] {
  return this.tableData
    .filter(e => e.day === day)                 // first filter by day
    .filter(e => {
      if (!this.searchText) return true;       // if no search, show all
      const search = this.searchText.toLowerCase();
      return (
        e.exam_name.toLowerCase().includes(search) ||
        e.start_time.toLowerCase().includes(search) ||
        e.end_time.toLowerCase().includes(search) ||
        e.exam_date.toLowerCase().includes(search)
      );
    });
}


  // ✅ Tab switcher
  switchTab(data: string) {
    this.Weekly = (data === "Weekly");
    this.Daily = (data === "daily");
    this.Grade = (data === "grade");
  }

  // ✅ API call
  loadexam() {
    const selectspparam = {
      spname: 'sp_getexam_detail',
      parameter1: this.reportrole,
      spparameter1: '@RoleName',
      parameter2: this.reportuserid,
      spparameter2: '@StudentID',
    };
    console.log("selectspparam filter", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam,
      { responseType: 'text' }
    );
  }

  // ✅ Fallback: derive day from exam_date
  private getDayFromDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return daysOfWeek[date.getDay()];
  }

  // ✅ Capitalize first letter (monday → Monday)
  private capitalize(day: string): string {
    if (!day) return '';
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  }
printSchedule() {
  if (!this.scheduleSection) {
    console.warn("⚠️ Schedule section not found!");
    return;
  }

  const printContents = this.scheduleSection.nativeElement.innerHTML;

  // Open a new window for printing
  const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  if (!popupWin) return;

  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Exam Schedule</title>
        <style>
          /* Copy your styles here */
          body { font-family: Arial, sans-serif; margin: 20px; }
          .timetable-grid { border-collapse: collapse; width: 100%; }
          .timetable-cell { border: 1px solid #ccc; padding: 8px; }
          .exam-item { margin-bottom: 10px; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContents}
      </body>
    </html>
  `);
  popupWin.document.close();
}




exportCalendar() {
  if (!this.tableData || this.tableData.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Convert JSON to worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);

  // Create a new workbook and append the worksheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exam Schedule');

  // Write workbook to binary
  const wbout: ArrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Save as Excel file
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'exam_schedule.xlsx');
}

}
