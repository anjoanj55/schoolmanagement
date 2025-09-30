import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EdituserComponent } from '../edituser/edituser.component';
import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {EditfeatureComponent} from '../editfeature/editfeature.component';
@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})
export class UsermanagementComponent {
 useres:boolean=true;
 roles:boolean=false;
 groups:boolean=false;
 features:boolean=false;
userdata: User[] = [];
filteredUsers: User[] = [];
searchTerm: string = '';
feutredata: any;
filteredfeature: fautremodule[] = [];
searchfeature: string = '';
  constructor(private dialog: MatDialog,private http: HttpClient) {}
 

  openfeaturePopup(user: any) {
  const userData = {
    RoleName: user.RoleName,
    RoleID: user.RoleID,
    features: user.Description,

  };

  // ✅ Store the dialog reference
  const dialogRef = this.dialog.open(EditfeatureComponent, {
    width: '400px',
    position: { right: '0' }, 
    panelClass: 'custom-dialog-panel',
    data: { userData }
  });


  dialogRef.afterClosed().subscribe((result: string | undefined) => {
    if (result === 'updated') { 
      this.loadfaturelist().subscribe(loadfeaturerole => {
      console.warn("loadfeaturerole", loadfeaturerole);
      this.feutredata = loadfeaturerole;
      });
    }
  });
}
openUserPopup(user: any) {
  const userData = {
    id: user.UserID,
    name: user.FirstName,
    email: user.Email,
    role: user.RoleName
  };

  // ✅ Store the dialog reference
  const dialogRef = this.dialog.open(EdituserComponent, {
    width: '400px',
    position: { right: '0' }, // Open from the right
    panelClass: 'custom-dialog-panel',
    data: { userData }
  });

  // ✅ Add explicit type for result to avoid "implicitly has 'any'" warning
  dialogRef.afterClosed().subscribe((result: string | undefined) => {
    if (result === 'updated') { // Only refresh if update happened
      this.loaduser().subscribe((loaduserdata: User[]) => {
    console.warn("loaduserdata", loaduserdata);
    this.userdata = loaduserdata;
    this.filteredUsers = [...loaduserdata]; // set filtered data
  });
    }
  });
}
   filterUsers(): void {
  const term = this.searchTerm.toLowerCase();
    console.log("Searching for:", this.searchTerm);
  this.filteredUsers = this.userdata.filter(user =>
    user.FirstName.toLowerCase().includes(term) ||
    user.Email.toLowerCase().includes(term) ||
    user.RoleName.toLowerCase().includes(term)
  );
    console.log("for:", this.filteredUsers);
}
// filterfautre(): void {
//   const term = this.searchTerm.toLowerCase();
//     console.log("Searching for:", this.searchTerm);
//   this.filteredfeature = this.feutredata.filter(fautremodule =>
//     fautremodule.RoleName.toLowerCase().includes(term) ||
//     fautremodule.RoleID.toLowerCase().includes(term) ||
//     fautremodule.Description.toLowerCase().includes(term)
//   );
//     console.log("for:", this.filteredfeature);
// }
  loaduser() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_select_User]');
    return this.http.get<User[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
  }
   loadfaturelist() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_Features]');
    return this.http.get("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
  }
 
  ngOnInit(): void {
       this.loaduser().subscribe((loaduserdata: User[]) => {
    console.warn("loaduserdata", loaduserdata);
    this.userdata = loaduserdata;
    this.filteredUsers = [...loaduserdata]; // set filtered data
  });
 this.loadfaturelist().subscribe(loadfeaturerole => {
    console.warn("loadfeaturerole", loadfeaturerole);
    this.feutredata = loadfeaturerole;
  });
  
  }
switchTab(userdata:string){
if(userdata=="users"){
  this.useres=true;
  this.roles=false;
  this.groups=false;
  this.features=false;
 }else if(userdata=="roles"){
 this.useres=false;
  this.roles=true;
  this.groups=false;
  this.features=false;
 }else if(userdata=='groups'){
   this.useres=false;
  this.roles=false;
  this.groups=true;
  this.features=false;
 }else if(userdata=='features'){
   this.useres=false;
  this.roles=false;
  this.groups=false;
  this.features=true;
 }
}
}
interface User {
  FirstName: string;
  Email: string;
  RoleName: string;
  // Add more fields if your API returns them
}
interface fautremodule {
  RoleName: string;
  RoleID: string;
  Description: string;
  // Add more fields if your API returns them
}
