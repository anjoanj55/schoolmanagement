import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserDataService } from '../../pages/services/user-data.service';
@Component({
  selector: 'app-studentreport',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './studentreport.component.html',
  styleUrl: './studentreport.component.css'
})
export class StudentreportComponent {
  selectedTabIndex = 0;
  isLoading = false;
  error: string | null = null;
  embedConfig: any = null;
  isBrowser = false;
  isBlurred = false;
  reportName: string = '';
  customerName: string = '';
  reportusername: string = ''; 
  reportrole: string = '';    

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  constructor(private userDataService: UserDataService) {
 
  }
  ngOnInit(): void {
     let rawUserData = this.userDataService.getUserData();
     console.log('Raw userData for report:', rawUserData);
    // If it's a string, parse it
  if (typeof rawUserData === 'string') {
    try {
      rawUserData = JSON.parse(rawUserData);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      rawUserData = [];
    }
  }

  // ✅ Store as lowercase
  if (Array.isArray(rawUserData) && rawUserData.length > 0) {
    this.reportusername = (rawUserData[0].UserName || '').toLowerCase();
    this.reportrole = (rawUserData[0].RoleName || '').toLowerCase();
  }

  console.log('Report Username:', this.reportusername);
  console.log('Report Role:', this.reportrole);




    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      setTimeout(() => this.loadReportByTab(this.selectedTabIndex), 0);
    }
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (this.isBrowser == true) {
      this.loadReportByTab(index);
    }
    console.log("selectedTabIndex", this.selectedTabIndex, this.isBrowser)
  }

  loadReportByTab(tabIndex: number): void {
    //this.reportName = this.tabReportMap[tabIndex] || 'EWS Dashboard';
    this.reportName = 'Varsity_School_Branch';
    this.customerName = 'Smartschool';
    this.loadPowerBIReport(this.reportName, this.customerName);
   
  }

  async loadPowerBIReport(reportName: string, customerName: string): Promise<void> {
  this.isBlurred = true;
  this.isLoading = true;
  this.error = null;

  // Build API URL with query params
  const apiUrl = `https://103.199.163.162/ReportsRLSapi/api/Service/LoadRLSReport?` +
    `reportName=${encodeURIComponent(reportName)}` +
    `&customerName=${encodeURIComponent(customerName)}` +
    `&email=${encodeURIComponent(this.reportusername)}` +
    `&roles=${encodeURIComponent(this.reportrole)}`;

  try {
    const data = await this.http.get<any>(apiUrl).toPromise();
    console.log("Power BI RLS Response:", data);

    if (!data?.id || !data?.embedUrl || !data?.embedToken) {
      this.error = 'Power BI Report or Embed Token not found.';
      this.embedConfig = null;
      return;
    }

    const powerbiModule: any = await import('powerbi-client');
    const powerbi = powerbiModule.default ?? powerbiModule;
    const models = powerbi.models;

    if (!models) {
      console.error('PowerBI models are undefined');
      this.error = 'Power BI client failed to load.';
      return;
    }

    this.embedConfig = {
      type: 'report',
      id: data.id,
      embedUrl: data.embedUrl,
      accessToken: data.embedToken, // Using embed token from API
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true },
        },
        background: models.BackgroundType.Transparent,
      },
    };

    setTimeout(() => {
      const embedContainer = document.getElementById('powerbi-container');
      if (embedContainer) {
        const powerbiService = new powerbi.service.Service(
          powerbi.factories.hpmFactory,
          powerbi.factories.wpmpFactory,
          powerbi.factories.routerFactory
        );
        powerbiService.reset(embedContainer);
        powerbiService.embed(embedContainer, this.embedConfig!);
      }
    }, 0);

  } catch (err) {
    console.error('Power BI load error:', err);
    this.error = 'Failed to load Power BI report.';
  } finally {
    this.isLoading = false;
    this.isBlurred = false;
  }
}

}
