import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { UserDataService } from '../../pages/services/user-data.service';
import {
  MatSidenavModule
} from '@angular/material/sidenav';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatToolbarModule
} from '@angular/material/toolbar';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatListModule
} from '@angular/material/list';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import { AiAgentComponent } from '../../pages/ai-agent/ai-agent.component'
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    AiAgentComponent,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSidebarOpen = true;
  isCollapsed = false;
  studentProfile=false;
   currentPage = 'Home';
  studentreport=false;
  dashboard=false;
  teachereport=false;
  parentseport=false;
  Transporteport=false;
  financereport=false;
  Adminreport=false;
  attendancereport=false;
  videotracking=false;
  aitrackingconfiguration=false;
  chatVisible = false;
  studentmenu=false;
  Facultymenu=false;
   Parentmenu=false;
   transportmenu=false;
   dimensioniewmenu=false;
   stockmenu=false;
   onlineclassmenu=false;
   adminmenu=false;
  username: string = localStorage.getItem('usrName') || '';
 
  constructor(private router: Router,private userDataService: UserDataService) {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event) => {
    //   const nav = event as NavigationEnd;
    //   this.updatePageName(nav.urlAfterRedirects);
    // });
     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.updatePageName(nav.urlAfterRedirects);
      });
  
  }
  
  //  private updatePageName(url: string) {
   
  //   const lastSegment = url.split('/').pop()?.replace('-', ' ') || 'Home';
  //   this.currentPage = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  // }
private updatePageName(url: string) {
  const segments = url.split('/').filter(Boolean);
  let mainPage = 'Home';

  // Mapping of route keywords → main page heading
  const menuMapping: { [key: string]: string } = {
    // Dashboards
    dashboard: 'Dashboards',
    studentdashboard: 'Student Dashboards',
    teacherreport: 'Teacher Dashboard',
    financereport: 'Finance Dashboard',
    parentseport: 'Parents Reports',

    // Main sections
    student: 'Student',
    faculty: 'Faculty',
    parents: 'Parents',
    Attendance: 'Student',
    TrackPersonComponent: 'Video Tracking',
    rulebuilder: 'Video Tracking',
    workflow: 'Video Tracking',
    Aiassesment: 'Video Tracking',
    transportation: 'Transportation',
    stockpage: 'Hostel Inventory',
    onlineclass: 'Online Classes',
    admin: 'Admin Center',
    usermanagement: 'Admin Center',
    dimensionview: 'School 3D View',
    videotracking: 'Video Tracking'
  };

  // find first match from URL
  const match = Object.keys(menuMapping).find(key =>
    segments.some(s => s.toLowerCase().includes(key))
  );

  if (match) {
    mainPage = menuMapping[match];
  }

  this.currentPage = mainPage;
}


  
  // Toggle between sidebar open/close and expanded/collapsed
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
 
  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }
 
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  
 ngOnInit(): void {
   

     const rawUserData = this.userDataService.getUserData();
  console.log('Raw userData:', rawUserData);

  let userData: any[];

  try {
    userData = JSON.parse(rawUserData);
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return;
  }

  if (Array.isArray(userData) && userData.length > 0) {
    const roleName = userData[0]?.RoleName;
     const ModuleID = userData[0]?.ModuleID;
 const moduleIdArray: number[] = ModuleID
  .split(',')
  .map((id: string) => parseInt(id, 10));
this.studentreport =  moduleIdArray.includes(9);
this.adminmenu =  moduleIdArray.includes(1);
this.dashboard= moduleIdArray.includes(38);
this.teachereport= moduleIdArray.includes(10);
this.parentseport= moduleIdArray.includes(6);
this.Transporteport= moduleIdArray.includes(11);
this.Adminreport= moduleIdArray.includes(2);
this.attendancereport= moduleIdArray.includes(3);
this.financereport= moduleIdArray.includes(4);
this.videotracking=moduleIdArray.includes(33);
this.studentmenu=moduleIdArray.includes(39);
this.studentProfile=moduleIdArray.includes(27);
this.Facultymenu=moduleIdArray.includes(40);
this.Parentmenu=moduleIdArray.includes(41);
this.transportmenu=moduleIdArray.includes(42);
this.dimensioniewmenu=moduleIdArray.includes(21);
this.stockmenu=moduleIdArray.includes(17);
this.onlineclassmenu=moduleIdArray.includes(19);



 console.log('teachereport:', this.teachereport);
    console.log('RoleName:', roleName);

  //   if (roleName?.toLowerCase() === 'student') {
  //     this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.financereport = false;
  //     this.Adminreport = false;
  //     this.Facultymenu=false;
  //     this.Parentmenu=false;
  //     this.stockmenu=false;
  //     this.aitrackingconfiguration = false;
  //     this.videotracking=false;
  //      this.adminmenu=false;
  //      this.onlineclassmenu=false;
  //   }else if(roleName === 'Accountant'){
  //     this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.Adminreport = false;
  //     this.aitrackingconfiguration = false;
  //     this.studentProfile=false;
  //     this.studentreport=false;
  //     this.attendancereport=false;
  //     this.videotracking=false;
  //     this.aitrackingconfiguration=false;
  //     this.studentmenu=false;
  //     this.Facultymenu=false;
  //     this.Parentmenu=false;
  //     this.transportmenu=false;
  //     this.dimensioniewmenu=false;
  //     this.stockmenu=false;
  //     this.onlineclassmenu=false;
  //     this.adminmenu=false;
  //     this.videotracking=false;
  //   }else if(roleName?.toLowerCase() === 'Faculty'){
  //      this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.financereport = false;
  //     this.Adminreport = false;
  //     this.Parentmenu=false;
  //     this.stockmenu=false;
  //     this.aitrackingconfiguration = false;
  //     this.videotracking=false;
  //     this.adminmenu=false;
  //   }else if(roleName?.toLowerCase() === 'Parent'){
  //      this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.financereport = false;
  //     this.Adminreport = false;
  //     this.Parentmenu=false;
  //     this.stockmenu=false;
  //     this.aitrackingconfiguration = false;
  //     this.videotracking=false;
  //     this.adminmenu=false;
  //     this.studentmenu=false;
  //     this.Facultymenu=false;
  //   }else if(roleName === 'CFO'){
  //     this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.Adminreport = false;
  //     this.aitrackingconfiguration = false;
  //     this.studentProfile=false;
  //     this.studentreport=false;
  //     this.attendancereport=false;
  //     this.videotracking=false;
  //     this.aitrackingconfiguration=false;
  //     this.studentmenu=false;
  //     this.Facultymenu=false;
  //     this.Parentmenu=false;
  //     this.transportmenu=false;
  //     this.dimensioniewmenu=false;
  //     this.stockmenu=false;
  //     this.onlineclassmenu=false;
  //     this.adminmenu=false;
  //     this.videotracking=false;
  //   }else if(roleName === 'BM'){
  //     this.teachereport = false;
  //     this.parentseport = false;
  //     this.Transporteport = false;
  //     this.Adminreport = false;
  //     this.aitrackingconfiguration = false;
  //     this.studentProfile=false;
  //     this.studentreport=false;
  //     this.attendancereport=false;
  //     this.videotracking=false;
  //     this.aitrackingconfiguration=false;
  //     this.studentmenu=false;
  //     this.Facultymenu=false;
  //     this.Parentmenu=false;
  //     this.transportmenu=false;
  //     this.dimensioniewmenu=false;
  //     this.stockmenu=false;
  //     this.onlineclassmenu=false;
  //     this.adminmenu=false;
  //     this.videotracking=false;
  //   }

  // } else {
  //   console.warn('User data is not a valid array.');
  // }
  }
  // updatePageName(url: string) {
  //   // Map the URL to a page name
  //   switch (url) {
  //     case '/home/pipelineworkflow':
  //       this.currentPage = 'Workflow';
  //       break;
  //     case '/home/predictiondashboard':
  //       this.currentPage = 'Prediction Dashboard';
  //       break;
  //     case '/home/dashboard':
  //       this.currentPage = 'Dashboard';
  //       break;
  //     case '/home/profile':
  //       this.currentPage = 'Client Profile';
  //       break;
  //     case '/home/airiskdetection':
  //       this.currentPage = 'AI Risk Detection';
  //       break;
  //     case '/home/workflow':
  //       this.currentPage = 'Historical Comparison';
  //       break;
  //     case '/home/scoreboard':
  //       this.currentPage = 'Risk Score Board';
  //       break;
  //     default:
  //       this.currentPage = 'Home';
  //   }
  // }
 
  // goToHostelInventory() {
  //   this.router.navigate(['/home/Stockpage']);
  // }
}
}

