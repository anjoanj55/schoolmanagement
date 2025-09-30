import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { UserDataService } from '../services/user-data.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule,FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentYear = new Date().getFullYear();
  uatUrl = environment.uat;
  userdata:any;
  email:string='';
  password:string='';
  constructor(private route: ActivatedRoute, private router: Router,private http: HttpClient,private userDataService: UserDataService
) { }
 
  loaduserdetails() {
    const selectspparam = {
      spname: "dbo.sp_UserLogin",
      parameter1: this.email,
      spparameter1: "@UserName",
      parameter2: this.password,
      spparameter2: "@Password"
    }
    console.log(selectspparam)
    return this.http.post('https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams', selectspparam, { responseType: 'text' })
  }
  ngOnInit(): void {
    
    
  }
login() {
  console.log('Login function triggered');
    this.loaduserdetails().subscribe((loaduserdata) => {
      console.warn("loaduserdata", loaduserdata)
      this.userdata = loaduserdata
   if (loaduserdata.length === 2) {
     console.warn(this.userdata.length);
      alert('Invalid Credentials!');
    } else {
           console.warn(this.userdata.length);
               this.userDataService.setUserData(this.userdata); 
                let userData: any[];

  try {
    userData = JSON.parse(this.userdata);
      const roleName = userData[0]?.RoleName;
    console.log('RoleName:', roleName);
      if(roleName=='Admin'){
     this.router.navigate(['/home/Studentprofile']);
       }else if(roleName=='Student'){
    this.router.navigate(['/home/Studentprofile']);
       }else if(roleName=='Accountant'){
          this.router.navigate(['/home/Financedashboard']);
       }else if(roleName=='CFO'){
         this.router.navigate(['/home/Financedashboard']);
       }else if(roleName=='BM'){
         this.router.navigate(['/home/Financedashboard']);
       }
       
       else if(roleName=='Faculty'){
         this.router.navigate(['/home/TeacherReport']);
       }else if(roleName=='Parent'){
         this.router.navigate(['/home/Studentprofile']);
       
       }else if(roleName=='Principal'){
         this.router.navigate(['/home/Studentprofile']);
       }else if(roleName=='Vice Principal'){
         this.router.navigate(['/home/Studentprofile']);
       }
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return;
  }
      }

    })
   
}

  handleLogin(): void {
     this.router.navigate(['/home/dashboard']);
    // console.log('Redirecting to Azure AD login:', this.uatUrl);
    // window.open(`${this.uatUrl}/cadenz/auth/azuread`, '_self');
  }
}
