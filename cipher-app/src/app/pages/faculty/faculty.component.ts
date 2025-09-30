import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-faculty',
  imports: [CommonModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.css'
})
export class FacultyComponent {
   uploadQuestion:boolean=true;
 uploadMarks:boolean=false;
 announcements:boolean=false;
 alertParents:boolean=false;

switchTab(data:string){
 if(data=="uploadQuestion"){
  this.uploadQuestion=true;
  this.uploadMarks=false;
  this.announcements=false;
  this.alertParents=false;
 }else if(data=="uploadMarks"){
    this.uploadQuestion=false;
  this.uploadMarks=true;
  this.announcements=false;
  this.alertParents=false;
 }else if(data=="announcements"){
   this.uploadQuestion=false;
  this.uploadMarks=false;
  this.announcements=true;
  this.alertParents=false;
 }
 else if(data=="alertParents"){
 this.uploadQuestion=false;
  this.uploadMarks=false;
  this.announcements=false;
  this.alertParents=true;
 }
  }
}
