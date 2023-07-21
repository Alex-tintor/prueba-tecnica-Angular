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

  states: string[] = [];

  maxAndMinData: { minState: string, minValue: number, maxState: string, maxValue: number } | null = null;


  constructor(private dbService:NgxIndexedDBService, private csv:ConvertCsvService){}

  async ngOnInit():Promise<void>{
    this.data = await this.csv.loadData()
    this.getStates()
    this.getMaxAndMinData()
  }


  getStates(){
    this.csv.getAllStates().subscribe(state => this.states = state)
  }

  getStatsByState(){
    this.csv.getMostRecentRecordsByState(this.states);
  }

  getMaxAndMinData(){
    this.csv.findExtremeStates("4/27/21").then(data => this.maxAndMinData = data);
  }


}
