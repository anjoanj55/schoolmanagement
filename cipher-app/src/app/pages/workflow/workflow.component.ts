import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-workflow',
  imports: [
    FormsModule,
    CommonModule,
    AgGridModule,
    HttpClientModule,
  ],
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  triggers: any[] = [];
  uatUrl = environment.uat;
  columnDefs: ColDef[] = [
    { headerName: 'Alert ID', field: 'id' },
    { headerName: 'Customer', field: 'customer' },
    { headerName: 'Risk Type', field: 'type' },
    { headerName: 'Severity', field: 'severity' },
    {
      headerName: 'Workflow',
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.innerText = 'View';
        button.className = 'workflow-btn';
        button.onclick = () => this.openWorkflow(params.data);
        return button;
      },
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  selectedTrigger: any = null;
  comment: string = '';
  decision: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTriggers();
  }

  fetchTriggers() {
    const token = localStorage.getItem('access_token');
    const url = `${this.uatUrl}/cadenz/triggers/defaultEWSTrigger`;

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token || ''
    };
    console.log('Trigger header:', headers);

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        console.log('Trigger API response:', response);
        const triggerData = response?.data?.triggerData || [];
        this.triggers = triggerData;
      },
      error: (err) => {
        console.error('Error fetching trigger data:', err);
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  openWorkflow(trigger: any) {
    this.selectedTrigger = trigger;
    this.comment = '';
    this.decision = '';
  }

  submitDecision() {
    if (this.decision) {
      console.log('Submitted Decision:', this.decision, 'Comment:', this.comment);
      this.selectedTrigger = null;
    } else {
      alert('Please select a decision.');
    }
  }
}
