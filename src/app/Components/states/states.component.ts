import { Component } from '@angular/core';

import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ConvertCsvService } from 'src/app/Services/convert-csv.service';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent {

  data: any[] = [];

  constructor(private dbService:NgxIndexedDBService, private csv:ConvertCsvService){}

  async ngOnInit():Promise<void>{
    this.data = await this.csv.loadData()
    this.getStates()
  }


  async getStates(){
    let totals = await this.csv.getInfo()
    let extremeStates = this.csv.findExtremeDeaths(totals)
    this.data = [extremeStates]
  }

}
