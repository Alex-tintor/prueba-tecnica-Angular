import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import * as Papa from 'papaparse';

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


}
