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

  constructor(private dbService:NgxIndexedDBService) { }

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

  getRecordsByState(state: string, records: any[][]): any[] {
    return records[0].filter(record => record.Province_State === state);
  }


  getMostRecentRecord(records: any[]): any {
    return records.reduce((mostRecent, current) => {
      const mostRecentDate = new Date(mostRecent["4/27/21"]);
      const currentDate = new Date(current["4/27/21"]);
      return currentDate > mostRecentDate ? current : mostRecent;
    }, records[0]);
  }

  async getMostRecentRecordsByState(states: string[]): Promise<{[state: string]: any}> {
    const allRecords = await this.loadData();  // Asume que loadData() devuelve todos los registros
    let mostRecentByState: {[state: string]: any} = {};
    for (let state of states) {
      const stateRecords = this.getRecordsByState(state, allRecords);
      mostRecentByState[state] = this.getMostRecentRecord(stateRecords);
    }
    return mostRecentByState;
  }

  async findExtremeStates(key: string) {
    let states: string[] = [];
    await this.getAllStates().toPromise().then(data => states = data || []);
    const mostRecentByState = await this.getMostRecentRecordsByState(states);
    let minValue = Infinity;
    let minState = "";
    let maxValue = -Infinity;
    let maxState = "";
    for (let state in mostRecentByState) {
      const record = mostRecentByState[state];
      if (record) {
        const value = record[key];
        if (value < minValue) {
          minValue = value;
          minState = state;
        }
        if (value > maxValue) {
          maxValue = value;
          maxState = state;
        }
      }
    }
    return {
      minState: minState,
      minValue: minValue,
      maxState: maxState,
      maxValue: maxValue
    };
  }
}
