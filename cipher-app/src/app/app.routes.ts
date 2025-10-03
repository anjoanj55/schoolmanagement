import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RuleBuilderComponent } from './pages/rule-builder/rule-builder.component';
import { AiAgentComponent } from './pages/ai-agent/ai-agent.component'
import { WorkflowComponent } from './pages/workflow/workflow.component';
import { AiassesmentComponent } from './pages/aiassesment/aiassesment.component';
import { OnlineclassComponent } from './pages/onlineclass/onlineclass.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { TransportationComponent } from './pages/transportation/transportation.component';
import { AttendanceanalysisComponent } from './pages/attendanceanalysis/attendanceanalysis.component';
import { StockpageComponent } from './pages/stockpage/stockpage.component';
import { OnilneclassmainpageComponent } from './pages/onilneclassmainpage/onilneclassmainpage.component';
import { UsermanagementComponent } from './pages/usermanagement/usermanagement.component';
import { RecordsComponent } from './pages/records/records.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { ExamdatesComponent } from './pages/examdates/examdates.component';
import { FacultyComponent } from './pages/faculty/faculty.component';
import { StudentreportComponent } from './pages/studentreport/studentreport.component';
 import { StudentprofileComponent } from './pages/studentprofile/studentprofile.component';

import { ProfitandlossComponent } from './pages/profitandloss/profitandloss.component';
import { PayrollComponent } from './pages/payroll/payroll.component';
import { FinancedashboardComponent } from './pages/financedashboard/financedashboard.component';
import { AcademicComponent } from './pages/academic/academic.component';
import { TrackPersonComponent } from './pages/track-person/track-person.component';
import { InvetorylistComponent } from './pages/invetorylist/invetorylist.component';
import { AireportsComponent } from './pages/aireports/aireports.component';
import {EditfeatureComponent} from './pages/editfeature/editfeature.component';
import { CurriculumadminComponent } from './pages/curriculumadmin/curriculumadmin.component';
import { CurriculumfacultyComponent } from './pages/curriculumfaculty/curriculumfaculty.component';
import { AiStudentReportComponent } from './pages/ai-student-report/ai-student-report.component';
import { ResultAnalysisComponent } from './pages/result-analysis/result-analysis.component';
import { TeacherMonitoringComponent } from './pages/teacher-monitoring/teacher-monitoring.component';
import { TeacherReportComponent } from './pages/teacher-report/teacher-report.component';
import { SectionOverviewComponent } from './pages/section-overview/section-overview.component';
import { SyllabusprogressComponent } from './pages/syllabusprogress/syllabusprogress.component';
import { AcademicprogressComponent } from './pages/academicprogress/academicprogress.component';
import { HostelInventoryDashboardComponent } from './pages/hostel-inventory-dashboard/hostel-inventory-dashboard.component';
import { KitchenInventoryDashboardComponent } from './pages/kitchen-inventory-dashboard/kitchen-inventory-dashboard.component';
import { ParkingManagementComponent } from './pages/parking-management/parking-management.component';
import { KitchenManagementComponent } from './pages/kitchen-management/kitchen-management.component';
import { LaundryManagementComponent } from './pages/laundry-management/laundry-management.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: NavbarComponent,
    children: [
      { path: 'StudentCurriculum', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'rulebuilder', component: RuleBuilderComponent },
      { path: 'aiagent', component: AiAgentComponent },
      { path: 'workflow', component: WorkflowComponent },
      { path: 'Aiassesment', component: AiassesmentComponent },
      { path: 'StudentOnlineClass', component: OnlineclassComponent },
      { path: 'StudentPerformance', component: PerformanceComponent },
      { path: 'Transportation', component: TransportationComponent },
       { path: 'Attendanceanalysis', component: AttendanceanalysisComponent },
         { path: 'Stockpage', component: StockpageComponent },
         { path: 'Onilneclassmainpage', component: OnilneclassmainpageComponent },
           { path: 'Usermanagement', component: UsermanagementComponent },
            { path: 'StudentTimeTable', component: RecordsComponent },
             { path: 'Attendance', component: AttendanceComponent },
               { path: 'Faculty', component: FacultyComponent },
               { path: 'StudentExamDates', component: ExamdatesComponent },
                { path: 'Studentreport', component: StudentreportComponent },
           { path: 'Studentprofile', component: StudentprofileComponent },
           { path: 'Attendance', component: AttendanceComponent },
           { path: 'Profitandloss', component: ProfitandlossComponent },
           { path: 'Payroll', component: PayrollComponent },
           { path: 'Financedashboard', component: FinancedashboardComponent },
           { path: 'Academic', component: AcademicComponent },
         { path: 'TrackPersonComponent', component: TrackPersonComponent },
  { path: 'Parents', component: InvetorylistComponent },
   { path: 'Aireports', component: AireportsComponent },
    { path: 'Editfeature', component: EditfeatureComponent },
      { path: 'Admin', component: CurriculumadminComponent },
         { path: 'Curriculumfaculty', component: CurriculumfacultyComponent },
         { path: 'AiReport', component: AiStudentReportComponent },
         { path: 'ResultAnalysis', component: ResultAnalysisComponent },
          { path: 'Monitoring', component: TeacherMonitoringComponent },
           { path: 'TeacherReport', component: TeacherReportComponent },
           { path: 'ClassOverview', component: SectionOverviewComponent },
            { path: 'SyllabusProgress', component: SyllabusprogressComponent },
           { path: 'AcademicProgress', component: AcademicprogressComponent },
           { path: 'HostelInventoryDashboard', component: HostelInventoryDashboardComponent},
          { path: 'KitchenInventoryDashboard', component: KitchenInventoryDashboardComponent },
          { path: 'ParkingManagementComponent', component: ParkingManagementComponent },
          { path: 'KitchenManagementComponent', component: KitchenManagementComponent },
          { path: 'LaundryManagementComponent', component: LaundryManagementComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];


