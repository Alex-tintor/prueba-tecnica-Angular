import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginForm:FormGroup;
  public isLoading:boolean = false;
  public loginFailed = false;

  constructor(private loginService:LoginService,private router:Router) {
    this.loginForm = new FormGroup({
      user: new FormControl('',[Validators.required,Validators.minLength(5)]),
      password: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(32)]),
    })
  }
  ngOnInit(): void {
    return
  }

  public isInvalid(control:string):boolean{
    return this.loginForm.controls[control].invalid && ( this.loginForm.controls[control].dirty || this.loginForm.controls[control].touched)
  }

  public getErrors(control:string):string{
    switch(control){
      case 'email':
        return this.getErrorsByControl(control,"Ingresa Correo del Sena o Empresarial","No es un Correo Valido");
      case 'password':
        return this.getErrorsByControl(control,"Contraseña suministrada por Administracion","Debe ser mayor a 8 digitos y menor a 16");
      default:
        return "Ha ocurrido algo insesperado"
    }
  }

  public isFormValid():boolean{
    return this.loginForm.valid;
  }

  private getErrorsByControl(control:string,defecto:string,errores:string):any{
    if(this.isInvalid(control))
      return errores
    return defecto;
  }

  public onSubmmit(){
    if(this.isFormValid()){
      this.isLoading = true;
      this.loginForm.disable()
      this.loginFailed = false;
      // Invocamos el llamado a login de la api
      this.loginService.login(this.loginForm.get('user')?.value, this.loginForm.get('password')?.value).then((result)=>{
        if(result){
          this.loginForm.disable()
          this.isLoading=true
          this.loginFailed = false
          this.router.navigate(['/dashboard/inicio']);
        }else{
          this.loginForm.enable()
          this.isLoading=false;
          this.loginFailed=true;
        }
      })
      return;
    }
    this.loginFailed = true;
  }


}
