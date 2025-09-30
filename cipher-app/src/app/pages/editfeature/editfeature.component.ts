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
  templateUrl: './editfeature.component.html',
  styleUrl: './editfeature.component.css'
})
export class EditfeatureComponent  implements OnInit {
  Name:string='';
  email:string='';
  role:string='';
  group:string='';
    selectedRoles: string[] = []; 
   // ✅ Hardcoded dropdown options
  rolesList: string[] = [];
  dropdownOpen: boolean = false;
  groupsList: string[] = ['Leadership', 'Faculty', 'Students', 'Parents', 'Principal'];
  constructor(private http: HttpClient,private dialogRef: MatDialogRef<EditfeatureComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private snackBar: MatSnackBar) {}

   closeDialog() {
    this.dialogRef.close();
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // onRoleChange(event: any) {
  //   const value = event.target.value;
  //   if (event.target.checked) {
  //     this.selectedRoles.push(value);
  //   } else {
  //     this.selectedRoles = this.selectedRoles.filter(role => role !== value);
  //   }
  // }
  updatefeature() {
    console.log('Name:', this.Name);
    console.log('Email:', this.email);
    console.log('Selected Roles:', this.selectedRoles);
  
  }

   ngOnInit(): void {
  this.Name=this.data.userData.RoleName
  this.email=this.data.userData.email
  this.group=this.data.userData.role
  this.role=this.data.userData.role
  console.warn("data", this.data)
  console.warn("data", this.group)
  this.loadRoles();
  this.loadfatures(this.Name)
  }

loadRoles() {
  let params1 = new HttpParams().set('spname', 'select distinct Feature from Modules');
  this.http
    .get<any[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
    .subscribe({
      next: (loadroledata) => {
        console.warn("loadroledata", loadroledata);
        // Load all available features into rolesList
        this.rolesList = loadroledata.map(r => r.Feature);
        
        // After loading all features, load the specific role features if Name exists
        if (this.Name) {
          this.loadfatures(this.Name);
        }
      },
      error: (err) => {
        console.error("Error loading roles", err);
      }
    });
}
loadfatures(roleName: string) {
  let params1 = new HttpParams().set('spname', `
    SELECT r.RoleName,
           STRING_AGG(m.Feature, ',') AS Features
    FROM Roles r
    CROSS APPLY dbo.SplitString(r.ModuleID, ',') s
    JOIN Modules m ON m.ID = s.value
    WHERE RoleName = '${roleName}'
    GROUP BY r.RoleName
  `);
  
  this.http
    .get<any[]>("https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
    .subscribe({
      next: (loadroledata) => {
        console.warn("loadroledata", loadroledata);
        
        if (loadroledata && loadroledata.length > 0) {
          // Split the comma-separated features string into an array
          const featuresString = loadroledata[0].Features;
          const roleFeaturesArray = featuresString ? featuresString.split(',').map((f: string) => f.trim()) : [];
          
          // Set these features as selected in the dropdown
          this.selectedRoles = roleFeaturesArray;
        }
      },
      error: (err) => {
        console.error("Error loading role features", err);
      }
    });
}
loadFeaturesAndSelectThem(roleName: string) {
  this.loadfatures(roleName);
}
onRoleChange(event: any) {
  const feature = event.target.value;
  const isChecked = event.target.checked;
  
  if (isChecked) {
    // Add feature to selected list if not already present
    if (!this.selectedRoles.includes(feature)) {
      this.selectedRoles.push(feature);
       console.warn("selectedRolesfou[adte", this.selectedRoles);
    }
  } else {
    // Remove feature from selected list
    const index = this.selectedRoles.indexOf(feature);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
      
    }
  }
  
  console.log('Selected features:', this.selectedRoles);
}
  getSelectedFeatures(): string[] {
  return this.selectedRoles;
}

// Method to clear all selections
clearAllSelections() {
  this.selectedRoles = [];
}

// Method to select all features
selectAllFeatures() {
  this.selectedRoles = [...this.rolesList];
}
  //  loadRoles() {
  //   let params1 = new HttpParams().set('spname', 'select distinct Feature from Modules');
  //   this.http
  //     .get<any[]>("https://192.168.1.4/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
  //     .subscribe({
  //       next: (loadroledata) => {
  //         console.warn("loadroledata", loadroledata);
  //         // Assuming API returns an array of objects like [{ RoleName: 'Admin' }]
  //         this.rolesList = loadroledata.map(r => r.Feature);
  //       },
  //       error: (err) => {
  //         console.error("Error loading roles", err);
  //       }
  //     });
  // }
  // loadfatures(roleName: string) {
  //   let params1 = new HttpParams().set('spname', `
  //   SELECT r.RoleName,
  //          STRING_AGG(m.Feature, ',') AS Features
  //   FROM Roles r
  //   CROSS APPLY dbo.SplitString(r.ModuleID, ',') s
  //   JOIN Modules m ON m.ID = s.value
  //   WHERE RoleName = '${roleName}'
  //   GROUP BY r.RoleName
  // `);
  //   this.http
  //     .get<any[]>("https://192.168.1.4/Smartschoolwebservices/api/Service/SQLLOADEXEC", { params: params1 })
  //     .subscribe({
  //       next: (loadroledata) => {
  //         console.warn("loadroledata", loadroledata);
  //         // Assuming API returns an array of objects like [{ RoleName: 'Admin' }]
  //         this.rolesList = loadroledata.map(r => r.Feature);
  //       },
  //       error: (err) => {
  //         console.error("Error loading roles", err);
  //       }
  //     });
  // }
 updateUserRole() {
  // if (!this.data.userData.id) {
  //   alert("Error: User ID is missing.");
  //   return;
  // }
  
  const requestData = {
  JSONFileparams: JSON.stringify([
    {
      RoleName:this.Name || '',    
        ModuleNames: [this.selectedRoles.join(',')]      
      // ModuleNames: this.selectedRoles     
    }
  ]),
  spname: "[dbo].[sp_Update_RolesFeature]"
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
