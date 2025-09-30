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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  selectedTabIndex = 0;
  isLoading = false;
  error: string | null = null;
  embedConfig: any = null;
  isBrowser = false;
  isBlurred = false;
  reportName: string = '';
  customerName: string = '';

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);


  ngOnInit(): void {
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
    this.reportName = 'Profile Dashboard';
    this.customerName = 'gktest';
    this.loadPowerBIReport(this.reportName, this.customerName);
   
  }

  async loadPowerBIReport(reportName: string, customerName: string): Promise<void> {
    this.isBlurred = true;
    this.isLoading = true;
    this.error = null;

    const apiUrl = `https://webconfigreport1.azurewebsites.net/api/Service/LoadPowerBIReportDataWithEmbedToken?name=${encodeURIComponent(reportName)}&customerName=${encodeURIComponent(customerName)}`;

    try {
      const data = await this.http.get<any>(apiUrl).toPromise();
      console.log("Power BI Response:", data);

      if (
        data?.toString().includes('not found in the database mapping') ||
        !data?.id ||
        !data?.accessToken
      ) {
        this.error = 'Power BI Report not found.';
        this.embedConfig = null;
        return;
      }

      const powerbi = await import('powerbi-client');

      this.embedConfig = {
        type: 'report',
        id: data.id,
        embedUrl: data.embedUrl,
        accessToken: data.accessToken,
        settings: {
          layoutType: powerbi.models.LayoutType.Custom,
          customLayout: {
            displayOption: powerbi.models.DisplayOption.FitToPage,
          },
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true },
          },
          background: powerbi.models.BackgroundType.Transparent,
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
