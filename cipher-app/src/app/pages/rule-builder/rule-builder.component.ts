import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SentalertsComponent } from '../sentalerts/sentalerts.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-rule-builder',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,  
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.css']
})
export class RuleBuilderComponent {
   constructor(private dialog: MatDialog,private snackBar: MatSnackBar){}
  activeTab: string = 'live';
  activeVideoTab: string = 'live';
  sessions = [
    { dateTime: 'Today, 2:30 PM', subject: 'Mathematics', duration: '45 min', students: 23, avgEngagement: '78%', status: 'Processing', statusClass: 'status-processing' },
    { dateTime: 'Today, 1:00 PM', subject: 'English', duration: '50 min', students: 28, avgEngagement: '82%', status: 'Completed', statusClass: 'status-completed' },
    { dateTime: 'Today, 11:30 AM', subject: 'Physics', duration: '45 min', students: 19, avgEngagement: '75%', status: 'Completed', statusClass: 'status-completed' },
    { dateTime: 'Today, 10:00 AM', subject: 'Chemistry', duration: '50 min', students: 25, avgEngagement: '69%', status: 'Completed', statusClass: 'status-completed' },
    { dateTime: 'Yesterday, 3:15 PM', subject: 'Biology', duration: '45 min', students: 22, avgEngagement: '86%', status: 'Completed', statusClass: 'status-completed' },
  ];
  filteredSessions = [...this.sessions];
  students = [
    { initials: 'SJ', name: 'Sarah Johnson', engagement: 'High', engagementClass: 'engagement-high' },
    { initials: 'MC', name: 'Michael Chen', engagement: 'High', engagementClass: 'engagement-high' },
    { initials: 'ED', name: 'Emily Davis', engagement: 'Medium', engagementClass: 'engagement-medium' },
    { initials: 'JW', name: 'James Wilson', engagement: 'Low', engagementClass: 'engagement-low' },
    { initials: 'AB', name: 'Ashley Brown', engagement: 'High', engagementClass: 'engagement-high' },
  ];

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  switchVideoTab(tab: string) {
    this.activeVideoTab = tab;
  }
  filterSessions(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSessions = this.sessions.filter(session =>
      session.subject.toLowerCase().includes(searchTerm) ||
      session.dateTime.toLowerCase().includes(searchTerm)
    );
  }
   openalert() {   
    console.log("alert"); 
           const dialogRef = this.dialog.open(SentalertsComponent, {
            width: '400px',
            position: { right: '0' }, 
            panelClass: 'custom-dialog-panel',
            data: null
          });
        
        
          dialogRef.afterClosed().subscribe((result: string | undefined) => {
            if (result === 'updated') { 
              
            }
          });
     }
     report() {
       this.snackBar.open('Creating Report.......', 'Close', {
      duration: 3000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style

    });
     }
      EXPORT() {
       this.snackBar.open('Exporting.....', 'Close', {
      duration: 4000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style

    });
     }
}

