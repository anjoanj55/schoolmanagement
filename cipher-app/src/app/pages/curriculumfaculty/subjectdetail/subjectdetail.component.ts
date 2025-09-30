import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-subjectdetail',
  imports:  [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './subjectdetail.component.html',
  styleUrl: './subjectdetail.component.css'
})
export class SubjectdetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
