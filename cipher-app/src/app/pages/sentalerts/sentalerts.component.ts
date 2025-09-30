import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-sentalerts',
  imports: [],
  templateUrl: './sentalerts.component.html',
  styleUrl: './sentalerts.component.css'
})
export class SentalertsComponent {
constructor(private dialogRef: MatDialogRef<SentalertsComponent>){}

closeDialog() {
    this.dialogRef.close();
  }
}
