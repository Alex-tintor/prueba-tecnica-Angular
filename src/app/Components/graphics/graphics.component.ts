import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ConvertCsvService } from 'src/app/Services/convert-csv.service';

Chart.register(...registerables)


@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements AfterViewInit{

  states : Array<string> = [];

  data : any[] = []

  chart: any;

  constructor(private csv:ConvertCsvService, private cd:ChangeDetectorRef){}

  async ngAfterViewInit():Promise<any> {
    this.data = await this.csv.loadData()
    await this.setDataByStates()
    console.log(Object.keys(this.data[0][0]))
    
    // for(let state of this.states){
    //   this.createPieChart(100,value.Population,value.Province_State,value.UID)
    // }
    // this.cd.detectChanges();
    

    // for(let value of this.data[0]){
    //   this.createPieChart(100,value.Population,value.Province_State,value.UID)
    // }
    // this.data.forEach(element => {
    //   console.log(element);
    // });
  }

  async ngOnInit(){
    

  }

  async setDataByStates() {
    return new Promise((resolve) => {
      this.csv.getAllStates().subscribe(estat => {
        this.states = estat;
        resolve(true);
      });
    });
  }

  createPieChart(muertes:number,poblacion:number, estado:string, id:string){
    this.chart = new Chart("UID"+id, {
      type: 'pie',
      data: {
        labels: ['muertes', 'poblacion'],
        datasets: [{
          label: 'total',
          data: [muertes, poblacion],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
          title:{
            display:true,
            text:estado
          }
        }
      }
    });
  }

}
