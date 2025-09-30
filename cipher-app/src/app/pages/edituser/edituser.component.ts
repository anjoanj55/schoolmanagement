import { Component ,OnInit} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams,HttpClientModule  } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edituser',
   standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,MatSnackBarModule],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css'
})
export class EdituserComponent  implements OnInit {
  Name:string='';
  email:string='';
  role:string='';
  group:string='';
   // ✅ Hardcoded dropdown options
  rolesList: string[] = [];
  groupsList: string[] = ['Leadership', 'Faculty', 'Students', 'Parents', 'Principal'];
  constructor(private http: HttpClient,private dialogRef: MatDialogRef<EdituserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private snackBar: MatSnackBar) {}

   closeDialog() {
    this.dialogRef.close();
  }
   ngOnInit(): void {
  this.Name=this.data.userData.name
  this.email=this.data.userData.email
  this.group=this.data.userData.role
  this.role=this.data.userData.role
  console.warn("data", this.data)
  console.warn("data", this.group)
    this.loadRoles();
    
  }
   loadRoles() {
    let params1 = new HttpParams().set('spname', 'select * from Roles where RoleID in (1,4,5,6,7,15,16)');
    this.http
      .get<any[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
      .subscribe({
        next: (loadroledata) => {
          console.warn("loadroledata", loadroledata);
          // Assuming API returns an array of objects like [{ RoleName: 'Admin' }]
          this.rolesList = loadroledata.map(r => r.RoleName);
        },
        error: (err) => {
          console.error("Error loading roles", err);
        }
      });
  }
 updateUserRole() {
  if (!this.data.userData.id) {
    alert("Error: User ID is missing.");
    return;
  }

  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      rolename: this.role || '',          
      userid: this.data.userData.id       
    }
  ]),
  spname: "[dbo].[sp_Update_User]"
};

 console.log("Request Payload:", JSON.stringify(requestData, null, 2));
  const apiUrl = 'https://103.199.163.162/Smartschoolwebservices/api/Service/GENERICSQLEXEC';

   this.http.post(apiUrl, requestData, { responseType: 'text' }).subscribe({
    next: (response) => {
      if (response.trim().toLowerCase() === "success") {
        // alert('User updated successfully');
         this.snackBar.open('User updated successfully', 'Close', {
      duration: 3000, // ✅ in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'] // optional custom style
    });
        this.dialogRef.close('updated'); // ✅ Send signal to refresh
      } else {
        alert('Failed to update user.');
      }
    },
    error: (error) => {
      console.error("API Error:", error);
      alert('Error updating user.');
    }
  });
}
}
