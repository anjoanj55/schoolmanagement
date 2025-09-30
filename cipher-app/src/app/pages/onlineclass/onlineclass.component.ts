import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../pages/services/user-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-onlineclass',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './onlineclass.component.html',
  styleUrl: './onlineclass.component.css'
})
export class OnlineclassComponent {
  reportusername: string = '';
    reportrole: string = '';
    reportuserid: number | null = null;
    
    searchText: string = '';
     classData: any = [];
     classDatastats: any = [];
    insights: { title: string; message: string }[] = [];
    searchTerm: string = '';
  filteredclassData: any[] = [];

constructor(
    private http: HttpClient,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
      // Setup Zoom SDK
    // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.17.0/lib', '/av'); // version can change
    // ZoomMtg.preLoadWasm();
    // ZoomMtg.prepareJssdk();
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



    this.loadonlineclass().subscribe({
        next: (res: string) => {
          try {
            this.classData = JSON.parse(res);
            this.filteredclassData = this.classData;
            console.log("✅ Parsed Online classData :", this.classData);
             this.insights = this.generateInsights(this.classData);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.classData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.classData = [];
        }
      });


      this.loadonlineclassstats().subscribe({
        next: (res: string) => {
          try {
            const data = JSON.parse(res);
      this.classDatastats = data[0] || {}; // take the first object
      
      console.log("✅ Parsed Online stats :", this.classDatastats);
            
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.classDatastats = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.classDatastats = [];
        }
      });
  }

joinClass(): void {
  if (typeof window === 'undefined') return;

  
  this.loadZoomCss();

  import('@zoom/meetingsdk').then((ZoomModule) => {
    const ZoomMtg = ZoomModule.ZoomMtg;

    
   ZoomMtg.setZoomJSLib('https://source.zoom.us/2.17.0/lib', '/av');

    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK(); 

    const meetingNumber = '89703160671';
    const passWord = 'pgAdD0';
    const userName = 'Student User';
    const userEmail = 'student@example.com';
    const sdkKey = '4_EDpnDS6mdqxjZxL87Dw';

  
    const signature =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiI0X0VEcG5EUzZtZHF4alp4TDg3RHciLCJhcHBLZXkiOiI0X0VEcG5EUzZtZHF4alp4TDg3RHciLCJtbiI6Ijg5NzAzMTYwNjcxIiwicm9sZSI6MCwiaWF0IjoxNzU2ODAwNDg1LCJleHAiOjE3NTY4MDA2MDUsInRva2VuRXhwIjoxNzU2ODA0MDg1LCJ2aWRlb193ZWJydGNfbW9kZSI6MX0.2LqlGU8yoR_MZ4mm2jBgUyPODtS45I33OuLKunbwR9I"; 

    const leaveUrl = window.location.href;

    ZoomMtg.init({
      leaveUrl,
      isSupportAV: true, 
      success: () => {
        console.log('✅ Init success');
        ZoomMtg.join({
          sdkKey,
          signature,
          meetingNumber,
          passWord,
          userName,
          userEmail,
          success: (res: any) => console.log('🎉 Join success', res),
          error: (err: any) => console.error('❌ Join error', err),
        });
      },
      error: (err: any) => console.error('❌ Init error', err),
    });
  });
}

private loadZoomCss(): void {
  const head = document.getElementsByTagName('head')[0];

  const zoomCssUrls = [
    'https://source.zoom.us/2.20.0/css/bootstrap.css',
    'https://source.zoom.us/2.20.0/css/react-select.css'
  ];

  zoomCssUrls.forEach(url => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      head.appendChild(link);
    }
  });
}


  


  generateInsights(data: any[]): { title: string; message: string }[] {
  if (!data.length) return [];

  const totalClasses = data.length;
  const totalParticipants = data.reduce((sum, d) => sum + Number(d.Participants || 0), 0);
  const avgParticipants = (totalParticipants / totalClasses).toFixed(1);

  const avgInteraction = (
    data.reduce((sum, d) => sum + parseFloat((d.Interaction || "0").replace("%", "")), 0) / totalClasses
  ).toFixed(1);

  const activeClass = data.find(d => d.status === "Live" || d.status === "Scheduled");
  const topClass = data.sort(
    (a, b) => parseFloat(b.Interaction) - parseFloat(a.Interaction)
  )[0];

  return [
    {
      title: "Current Class Status",
      message: activeClass
        ? `${activeClass.subject} session is ${activeClass.status} with ${activeClass.Participants} participants, showing ${activeClass.Interaction} interaction.`
        : "No live/scheduled class at the moment."
    },
    {
      title: "Interaction Analytics",
      message: `Average engagement across sessions is ${avgInteraction}%. Highest engagement is in ${topClass.subject} with ${topClass.Interaction}.`
    },
    {
      title: "Technical Issues",
      message: `On average, ${avgParticipants} students per class participated. (If API includes issue data, we can calculate and show it here.)`
    },
    {
      title: "Recommended Actions",
      message: `Boost interaction by focusing on classes with below-average engagement (< ${avgInteraction}%).`
    }
  ];
}

  exportData(): void {
    console.log("💾 Exporting Onlineclass data...");
  
    if (!this.classData || !this.classData.length) {
      console.warn("⚠️ No Onlineclass data available.");
      alert("No Onlineclass data to export.");
      return;
    }
  
    // Convert subjectData to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.classData);
  
    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Onlineclass Data");
  
    // Write workbook
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });
  
    saveAs(blob, "Onlineclass_Schedule.xlsx");
    console.log("✅ Data export complete");
  }


  exportInsightsExcel(): void {
    console.log('🔹 Export Insights started');
  
    if (!this.insights || !this.insights.length) {
      console.warn('⚠️ No insights to export.');
      alert('No insights to export.');
      return;
    }
  
    console.log('📊 Onlineclass Insights:', this.insights);
  
    // Map insights to a worksheet-friendly format
    const worksheetData: { Title: string; Message: string }[] = this.insights.map(
      (insight: { title: string; message: string }) => {
        console.log('➡️ Processing insight:', insight);
        return {
          Title: insight.title,
          Message: insight.message
        };
      }
    );
  
    console.log('📝 Worksheet data prepared:', worksheetData);
  
    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
    console.log('📄 Worksheet created', ws);
  
    // Create a workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Onlineclass Insights');
    console.log('📚 Workbook created', wb);
  
    // Write the workbook and trigger download
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });
  
    console.log('💾 Saving file...');
    saveAs(blob, 'Onlineclass.xlsx');
    console.log('✅ Export complete');
  }
  filteronline(term: string) {
  term = term.toLowerCase(); // case-insensitive search
  this.filteredclassData = this.classData.filter((record: any) =>
    (record.datetime && record.datetime.toLowerCase().includes(term)) ||
    (record.subject && record.subject.toLowerCase().includes(term)) ||
    (record.Participants && record.Participants.toString().toLowerCase().includes(term)) ||
    (record.Duration && record.Duration.toLowerCase().includes(term)) ||
    (record.Interaction && record.Interaction.toLowerCase().includes(term)) ||
    (record.status && record.status.toLowerCase().includes(term)) ||
    (record.Actions && record.Actions.toLowerCase().includes(term))
  );
}


  loadonlineclass() {
    const selectspparam = {
      spname: 'sp_onlineclassstatus_get',
      parameter1: this.reportrole,
      spparameter1: '@Role',
      parameter2: '',
      spparameter2: '',
    };
    console.log("selectspparam filter", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam,
      { responseType: 'text' }
    );
  }
  loadonlineclassstats() {
    const selectspparam = {
      spname: 'Sp_onlineclass_get',
      parameter1: this.reportrole,
      spparameter1: '@Role',
      parameter2: '',
      spparameter2: '',
    };
    console.log("selectspparam filter", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam,
      { responseType: 'text' }
    );
  }

}
