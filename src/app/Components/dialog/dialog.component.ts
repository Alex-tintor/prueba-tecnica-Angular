import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Input() message:string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public messageIn:string) {
    this.message = messageIn
  }

}