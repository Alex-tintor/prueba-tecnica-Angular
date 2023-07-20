import { Component } from '@angular/core';

import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent {

  datos: any[] = [];

  constructor(private dbService:NgxIndexedDBService){}

  ngOnInit():void{
    this.loadData()
    this.verdespues()
  }

  private loadData(){
    this.dbService.getAll('dataFile').subscribe((datos=>{this.datos = datos}),(error)=>{console.log(error)})
  }

  verdespues(){
    setTimeout(() => {
      console.log(this.datos)
    },5000);
  }
  

}
