import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-tracking-history',
  standalone: true, // 👈 important
  imports: [CommonModule, MatTableModule,HttpClientModule],
  templateUrl: './tracking-history.component.html',
  styleUrls: ['./tracking-history.component.css']
})
export class TrackingHistoryComponent implements OnInit {
displayedColumns: string[] = [
  'Name',
  'Start Date',
  'End Date',
  'Person Found DateTime',
  'Location Name',
  'Zone Name',
  'Camera Name',
  'Person Found Emotion'
];
  historyData: any[] = [];
  loading = true;

  // constructor(private http: HttpClient) {}

     constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TrackingHistoryComponent>
  ) {}


  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    let params1 = new HttpParams().set('spname', '[dbo].[sp_Select_TrackingHistory]');
    this.http.get<any[]>(
      "https://103.199.163.162/Smartschoolwebservices/api/Service/SQLLOADEXEC",
      { params: params1 }
    ).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.historyData = res;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

    closeDialog() {
    this.dialogRef.close();
  }

}
