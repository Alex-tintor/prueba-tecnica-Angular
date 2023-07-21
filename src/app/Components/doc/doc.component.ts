import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConvertCsvService } from 'src/app/Services/convert-csv.service';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent {

  @ViewChild('fileInput') fileInput!: ElementRef

  public formFile:FormGroup;
  public isLoading:boolean = false;
  public uploadFailed = false;

  constructor(private csv:ConvertCsvService,private router:Router) {
    this.formFile = new FormGroup({
      doc: new FormControl('',[Validators.required]),
    })
  }
  ngOnInit(): void {
    return
  }

  public isInvalid(control:string):boolean{
    return this.formFile.controls[control].invalid && ( this.formFile.controls[control].dirty || this.formFile.controls[control].touched)
  }

  public getErrors(control:string):string{
    if(control == 'doc'){
      return this.getErrorsByControl(control,"Por favor cargue un documento valido (.csv)","No es un archivo valido");
    }
    return "Ha ocurrido algo insesperado"
  }

  public isFormValid():boolean{
    return this.formFile.valid;
  }

  private getErrorsByControl(control:string,defecto:string,errores:string):any{
    if(this.isInvalid(control))
      return errores
    return defecto;
  }

  public onSubmmit(){
    const file = this.fileInput.nativeElement.files[0];
    if(this.isFormValid()){
      let dialogRef;
      this.isLoading = true;
      this.formFile.disable();
      this.uploadFailed = false;
      this.csv.parseFile(file)
        .then(() => {
          this.isLoading = false;
          this.uploadFailed = false;
          this.router.navigate(['/dashboard/estados'])
        })
        .catch(error => {
          console.log(error);
          this.uploadFailed = true;
        })
        .finally(() => {
          this.isLoading = true;
          this.formFile.enable();
        });
    } else {
      this.uploadFailed = true;
    }
  }


}
