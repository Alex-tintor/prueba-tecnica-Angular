import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConvertCsvService {

  constructor(private dbService:NgxIndexedDBService) {
    this.getInfo();
  }

  parseFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          this.dbService.add('dataFile', { data: JSON.stringify(result.data) })
            .subscribe({
              next: () => resolve(result.data),
              error: (err) => { reject(err)}
          });
        },
        error: (error, file) => {
          console.log(error)
          reject(error);
        }
      });
    });
  }
  loadData(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        this.dbService.getAll('dataFile').subscribe(
            (dataArray: any[]) => {
                resolve(dataArray.map(data => JSON.parse(data.data)));
            },
            error => {
                reject(error);
            }
        );
    });
  }

  getAllStates(): Observable<string[]> {
    return this.dbService.getAll('dataFile').pipe(
        map((dataArray: any[]) => {
            let states: any[] = dataArray.map(data => JSON.parse(data.data));
            let estadosSet = new Set<string>();
            for (let data of states[0]) {
              estadosSet.add(data.Province_State);
            }
            return Array.from(estadosSet);
        })
    );
  }

  async getInfo():Promise<any>{
    let data :any[] =[] ;
    data = await this.loadData()
    let maxDate = this.getLatestDate(Object.keys(data[0][0]));
    // console.log(maxDate)

    let filterObj = data[0].map((e:any) => ({state: e.Province_State, population: e.Population, deaths: e[maxDate], uid : e.UID}));
    // console.log(filterObj[0])
    let totals = filterObj.reduce((acc:any, obj:any) => {
      acc[obj.state] = (acc[obj.state] || {population: 0, deaths: 0});
      acc[obj.state].population += Number(obj.population);
      acc[obj.state].deaths += Number(obj.deaths);
      acc[obj.state].uid = Number(obj.uid);
      return acc;
    }, {});
    return totals;
  }

  getLatestDate(arr: string[]): string {
    let dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    let dateArr = arr.filter(str => dateRegEx.test(str));
    let dateObjects = dateArr.map(dateStr => {
      let [month, day, year] = dateStr.split('/');
      // Ajuste para fechas de dos dígitos
      if(year.length === 2) {
        year = "20" + year;
      }
      return {
        date: new Date(`${year}-${month}-${day}`),
        original: dateStr
      };
    });
    let latestDate = dateObjects.reduce((latest, current) => {
      return current.date > latest.date ? current : latest;
    }, dateObjects[0]);
    return latestDate.original;
  }

  findExtremeDeaths = (totals: {[key: string]: {population: number, deaths: number}}):
    {minState: string, minDeaths: number, maxState: string, maxDeaths: number} =>
    Object.entries(totals).reduce((acc, [state, data]) => {
        if (data.deaths < acc.minDeaths) {
            acc.minDeaths = data.deaths;
            acc.minState = state;
        }
        if (data.deaths > acc.maxDeaths) {
            acc.maxDeaths = data.deaths;
            acc.maxState = state;
        }
        return acc;
    }, {minState: '', minDeaths: Infinity, maxState: '', maxDeaths: -Infinity});


}
