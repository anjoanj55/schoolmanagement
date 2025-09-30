import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserDataService } from '../../pages/services/user-data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PaymentHistoryPopupComponent } from './payment-history-popup/payment-history-popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-invetorylist',
  imports: [CommonModule,HttpClientModule,MatDialogModule],
  templateUrl: './invetorylist.component.html',
  styleUrl: './invetorylist.component.css'
})
export class InvetorylistComponent {
     feePayments:boolean=true; 
  alerts:boolean=false;
   studentProgress:boolean=false;
   announcements:boolean=false;
   reportuserid: number | null = null;
   feeData: any = [];
   feeatribute: any = [];
    feehistory: any = [];
   reportrole: string | null = null;
    parentid: string | null = null;
     reportusername: string = ''; 
     recentpayment: any = [];
     showPaymentHistory: boolean = false;
//   switchTab(userdata:string){
// if(userdata=="feePayments"){
 
//  }
// }
switchTab(data: string) {

  this.feePayments = (data === 'feePayments');
  this.alerts = (data === 'alerts');
  this.studentProgress = (data === 'studentProgress');
  this.announcements = (data === 'announcements');
}


constructor(private dialog: MatDialog,private http: HttpClient,private userDataService: UserDataService) {
 
  }


   // Open modal
  openPaymentHistory() {
 if( this.feehistory .length > 0){
                this.dialog.open(PaymentHistoryPopupComponent, {
                     width: '900px',
                     height: '100vh',
                     position: { right: '0' },
                     panelClass: 'custom-dialog-panel',
                     data: {feehistory:this.feehistory},
                    });
                 console.log("✅ injected feehistory:", this.feehistory);
                }
    
    
  }
  // Close modal
  closePaymentHistory() {
    this.showPaymentHistory = false;
  }
    contactSchool() {
    this.openPaymentHistory();
  }
  ngOnInit(): void {
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

 this.fetchFeePayments().subscribe({
        next: (res: string) => {
          try {
            this.feeData = JSON.parse(res);
            console.log("✅ Parsed feeData:", this.feeData);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.feeData = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.feeData = [];
        }
      });

       this.fetchFeehistory().subscribe({
        next: (res: string) => {
          try {
            this.feehistory = JSON.parse(res);
            console.log("✅ Parsed feehistory:", this.feehistory);
           

           } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.feehistory = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.feehistory = [];
        }
      });
 this.fetchfeeatribute().subscribe({
        next: (res: string) => {
          try {
            this.feeatribute = JSON.parse(res);
            console.log("✅ Parsed feeatribute:", this.feeatribute);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.feeatribute = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.feeatribute = [];
        }
      });
 
   this.fetchrecentpayment().subscribe({
        next: (res: string) => {
          try {
            this.recentpayment = JSON.parse(res);
            console.log("✅ Parsed recentpayment:", this.recentpayment);
          } catch {
            console.error("❌ Not valid JSON. Raw response:", res);
            this.recentpayment = [];
          }
        },
        error: (err) => {
          console.error("API Error:", err);
          this.feehistory = [];
        }
      });
   
  }

  

    
    fetchFeePayments() {
    const selectspparam = {
      spname: '[dbo].[sp_GetFeeDetails]',
      parameter1: this.reportrole,
      spparameter1: '@Role',
      parameter2: this.reportuserid,
      spparameter2: '@parentid',
    };

    console.log("📡 Fetching Fee Data with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }

  fetchfeeatribute() {
    const selectspparam = {
      spname: '[dbo].[sp_Get_feeatribute]',
      parameter1: this.reportrole,
      spparameter1: '@Role',
      parameter2: this.reportuserid,
      spparameter2: '@parentid',
    };

    console.log("📡 Fetching Fee atribute with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }

  fetchFeehistory() {
    const selectspparam = {
      spname: '[dbo].[sp_Get_paymenthistory]',
      parameter1: this.reportrole,
      spparameter1: '@Role',
      parameter2: this.reportuserid,
      spparameter2: '@parentid',
    };

    console.log("📡 Fetching paymenthistory Data with params:", selectspparam);

    return this.http.post(
      'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
      selectspparam, { responseType: 'text' }
    );
  }
  fetchrecentpayment() {
      const selectspparam = {
        spname: '[dbo].[sp_Get_recentpaymenthistory]',
        parameter1: this.reportrole,
        spparameter1: '@Role',
        parameter2: this.reportuserid,
        spparameter2: '@parentid',
      };

      console.log("📡 Fetching recentpayment Data with params:", selectspparam);

      return this.http.post(
        'https://103.199.163.162/Smartschoolwebservices/api/Service/SelectSpwithparams',
        selectspparam, { responseType: 'text' }
      );
    }
}