import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-performancedetail',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule], // ✅ import modules here
  templateUrl: './performancedetail.component.html',
  styleUrls: ['./performancedetail.component.css']
})
export class PerformancedetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PerformancedetailComponent>
  ) {}
   ngOnInit() {
    console.log('Dialog opened with data:', this.data); // ✅ Check what is received
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
