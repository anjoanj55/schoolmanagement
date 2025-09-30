import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../pages/services/user-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PerformancedetailComponent } from '../performancedetail/performancedetail.component';
import { MatDialogModule } from '@angular/material/dialog';

const vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : pdfFonts;
(pdfMake as any).vfs = vfs;

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, NgClass, HttpClientModule,FormsModule,MatDialogModule ], // ✅ needed for standalone
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.css'
})
export class PerformanceComponent {

 reportusername: string = ''; 
  reportrole: string = '';  
    subjectData: any[] = [];
      reportuserid: number | null = null;
      // Header stats
  assessments: number = 0;
  avgScore: string = '0%';
  participationRate: string = '0%';
  improvementPlans: number = 0;
 performanceInsights: any;
 filteredData: any[] = [];
  searchTerm: string = '';
  filteredSubjectData: any[] = [];

  constructor( private http: HttpClient,private userDataService: UserDataService,private dialog: MatDialog) {
   
    }

    
ngOnInit(): void {

    let rawUserData = this.userDataService.getUserData();
    if (typeof rawUserData === 'string') {
      try { rawUserData = JSON.parse(rawUserData); } 
      catch { rawUserData = []; }
    }

    if (Array.isArray(rawUserData) && rawUserData.length > 0) {
      this.reportuserid = rawUserData[0].UserID || null;
      this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
      this.reportrole = (rawUserData[0].RoleName || '').toLowerCase();
    }

    this.loadsubjectdetails().subscribe({
      next: (res: string) => {
        try {
          this.subjectData = JSON.parse(res);
 this.filteredSubjectData = this.subjectData;
          // Compute stats dynamically
          this.assessments = this.subjectData.length;
          this.avgScore = this.calculateAvgScore(this.subjectData);
          this.participationRate = this.calculateParticipation(this.subjectData);
          this.improvementPlans = this.calculateImprovementPlans(this.subjectData);
           this.performanceInsights = this.generateInsights(this.subjectData);
          console.log(" JSON response:", res);

        } catch {
          console.error("Invalid JSON response:", this.subjectData);
          this.subjectData = [];
          this.performanceInsights = [];
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.subjectData = [];
         this.performanceInsights = [];
      }
    });
  }
openDetails(subject: any) {
   console.log('Opening dialog with subject:', subject);
    this.dialog.open(PerformancedetailComponent, {
      width: '450px',
      height: '100vh',     
      position: { right: '0px', top: '0px' }, 
      data: subject,
      panelClass: 'custom-dialog-container'
    });
  }

  generateInsights(data: {
  Date: string;
  first_name: string;
  last_name: string;
  subject_name: string;
  MarksObtained: string | number;
  Remarks: string;
}[]): { title: string; message: string }[] {

  if (!data.length) return [];

  const totalStudents = data.length;
  const passedStudents = data.filter(d => d.Remarks === 'Pass').length;
  const failedStudents = totalStudents - passedStudents;

  // Average score
  const avgScore = (
    data.reduce((sum, d) => sum + Number(d.MarksObtained || 0), 0) / totalStudents
  ).toFixed(1);

  // Build a Map of subject -> scores
  const subjectMap: Map<string, number[]> = new Map();
  data.forEach(d => {
    const subject = d.subject_name;
    const score = Number(d.MarksObtained || 0);
    if (!subjectMap.has(subject)) subjectMap.set(subject, []);
    subjectMap.get(subject)!.push(score); // ! tells TS it’s definitely there
  });

  // Convert map to array and compute average per subject
  const subjectsWithAvg = Array.from(subjectMap.entries())
    .map(([subject, scores]) => ({
      subject,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => b.avg - a.avg);

  const lowestSubjects = subjectsWithAvg.slice(-2).map(s => s.subject).join(', ');

  // Build insights
  const insights = [
    {
      title: 'Assessment Performance',
      message: `${passedStudents} out of ${totalStudents} students passed. Average score is ${avgScore}%.`
    },
    {
      title: 'Participation Trends',
      message: `Participation rate is ${(totalStudents / totalStudents * 100).toFixed(1)}%.`
    },
    {
      title: 'Improvement Recommendations',
      message: `${failedStudents} students need improvement in subjects: ${lowestSubjects}.`
    },
    {
  title: 'Subject Weaknesses',
  message: `Analysis indicates that the subjects with the lowest average scores are ${lowestSubjects}. It is recommended to focus additional learning support and targeted interventions in these areas to improve overall student performance.`
}

  ];

  return insights;
}





exportInsightsExcel(): void {
  console.log('🔹 Export Insights started');

  if (!this.performanceInsights || !this.performanceInsights.length) {
    console.warn('⚠️ No insights to export.');
    alert('No insights to export.');
    return;
  }

  console.log('📊 Performance Insights:', this.performanceInsights);

  // Map insights to a worksheet-friendly format
  const worksheetData: { Title: string; Message: string }[] = this.performanceInsights.map(
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
  XLSX.utils.book_append_sheet(wb, ws, 'Performance Insights');
  console.log('📚 Workbook created', wb);

  // Write the workbook and trigger download
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });

  console.log('💾 Saving file...');
  saveAs(blob, 'performance_insights.xlsx');
  console.log('✅ Export complete');
}



filterPerformance(term: string) {
  term = term.toLowerCase(); // case-insensitive search
  this.filteredSubjectData = this.subjectData.filter(record => 
    record.first_name.toLowerCase().includes(term) ||
    record.last_name.toLowerCase().includes(term) ||
    record.subject_name.toLowerCase().includes(term) ||
    (record.MarksObtained + '').includes(term) || // if you want to search by marks
    record.Remarks.toLowerCase().includes(term)
  );
}
 


loadsubjectdetails() {
    const selectspparam = {
      spname: "Sp_performance_get",
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

  
  
  // --- Utility Methods ---
  // calculateAvgScore(data: any[]): string {
  //   if (!data.length) return '0%';
  //   const total = data.reduce((sum, d) => sum + (d.Score || 0), 0);
  //   return ((total / data.length) || 0).toFixed(1) + '%';
  // }

  // calculateParticipation(data: any[]): string {
  //   if (!data.length) return '0%';
  //   const total = data.reduce((sum, d) => sum + (d.Participation || 0), 0);
  //   return ((total / data.length) || 0).toFixed(1) + '%';
  // }

  // calculateImprovementPlans(data: any[]): number {
  //   return data.filter(d => d.Status === 'Low').length;
  // }
  // --- Average Score ---
calculateAvgScore(data: any[]): string {
  if (!data.length) return '0%';
  // Sum MarksObtained (convert to number)
  const total = data.reduce((sum, d) => sum + Number(d.MarksObtained || 0), 0);
  return ((total / data.length) || 0).toFixed(1) + '%';
}

// --- Participation ---
// calculateParticipation(data: any[]): string {
//   if (!data.length) return '0%';

//   const total = data.reduce((sum, d) => sum + (Number(d.Participation) || 0), 0);
//   return ((total / data.length) || 0).toFixed(1) + '%';
// }
calculateParticipation(data: any[]): string {
  if (!data.length) return '0%';
  
  // Count all students as "participated"
  const totalStudents = data.length;
  
  // If you want, you can filter based on Remarks or other criteria
  // For now, assume all students in the response participated
  const participated = totalStudents; 

  // Participation rate as percentage
  return ((participated / totalStudents) * 100).toFixed(1) + '%';
}


// --- Improvement Plans ---
calculateImprovementPlans(data: any[]): number {
  // Count students with Remarks = 'Low' or 'Fail'
  return data.filter(d => d.Remarks === 'Low' || d.Remarks === 'Fail').length;
}



// --- Get unique students with calculated Status ---
getUniqueStudents() {
  // Use a Map to avoid duplicates by first+last name
  const map = new Map<string, any>();

  this.subjectData.forEach(student => {
    const key = student.first_name + ' ' + student.last_name;

    // Calculate Status based on MarksObtained
    let status = 'Low';
    const marks = Number(student.MarksObtained || 0);
    if (marks >= 75) status = 'High';
    else if (marks >= 50) status = 'Medium';
    else status = 'Low';

    map.set(key, { ...student, Status: status });
  });

  return Array.from(map.values());
}

// --- Get initials for avatar ---
getInitials(name: string | undefined | null): string {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}



  // Get CSS class for performance badge
  getPerformanceClass(status: string) {
  switch(status) {
    case 'High': return 'performance-high';
    case 'Medium': return 'performance-medium';
    case 'Low': return 'performance-low';
    default: return '';
  }
}


// Generate a simple performance report (insights + stats)
generateReport(): void {
  console.log("📑 Generating subjectData PDF report...");

  if (!this.subjectData || !this.subjectData.length) {
    console.warn("⚠️ No subject data available.");
    alert("No subject data to generate report.");
    return;
  }

  // Helper function to format date and time as DD-MM-YYYY HH:MM:SS
  const formatDateTime = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  // Convert subjectData into table rows
  const tableBody = [
    [
      { text: "Date", style: "tableHeader" },
      { text: "Student", style: "tableHeader" },
      { text: "Subject", style: "tableHeader" },
      { text: "Score", style: "tableHeader" },
      { text: "Status", style: "tableHeader" }
    ],
    ...this.subjectData.map(record => [
     new Date(record.Date).toLocaleDateString("en-GB"),
      `${record.first_name} ${record.last_name}`,
      record.subject_name,
      record.MarksObtained + "%",
      record.Remarks
    ])
  ];

  const docDefinition: any = {
    content: [
      { text: " Student Performance Report", style: "header" },
      { text: `Generated on: ${formatDateTime(new Date())}`, style: "subheader" },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "auto", "auto"],
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

  pdfMake.createPdf(docDefinition).open(); // opens in new tab
  // pdfMake.createPdf(docDefinition).download("student_performance_report.pdf"); // to download directly
}





// Export raw performance table data to Excel
exportData(): void {
  console.log("💾 Exporting performance data...");

  if (!this.subjectData || !this.subjectData.length) {
    console.warn("⚠️ No performance data available.");
    alert("No performance data to export.");
    return;
  }

  // Format dates in subjectData
  const formattedData = this.subjectData.map(item => {
    const newItem = { ...item };
    for (const key in newItem) {
      if (newItem[key] instanceof Date || /^\d{4}-\d{2}-\d{2}T/.test(newItem[key])) {
        const date = new Date(newItem[key]);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        newItem[key] = `${dd}-${mm}-${yyyy}`;
      }
    }
    return newItem;
  });

  // Convert formatted data to worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

  // Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Performance Data");

  // Write workbook
  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob: Blob = new Blob([wbout], { type: "application/octet-stream" });

  saveAs(blob, "performance_data.xlsx");
  console.log("✅ Data export complete");
}




}
