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

  data : any[] = []

  chart: any;

  ids:string[] = []

  constructor(private csv:ConvertCsvService, private cd:ChangeDetectorRef){}

  async ngAfterViewInit():Promise<any> {
    let totals= await this.csv.getInfo()
    this.data = [totals];
    this.cd.detectChanges();
    this.data.forEach(value => {
      Object.values(value).forEach((sec: any) => {
        let elementId = "UID"+sec.uid ;
        this.ids.push(elementId);
        console.log("Creando gráfico para el elemento con ID:", elementId);
        this.createPieChart(sec.deaths, sec.population, elementId);
      });
    });
  }

  async ngOnInit(){}

  createPieChart(muertes:number,poblacion:number, id:string){
    this.chart = new Chart(id, {
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
        maintainAspectRatio: false
      }
    });
  }

}
