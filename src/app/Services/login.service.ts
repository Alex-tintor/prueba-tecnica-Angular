import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router:Router) { }

  login(user: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        if (user === "usuarioDePrueba@gmail.com" && password === "usuarioDePrueba@gmail.com") {
          localStorage.setItem('isLogged', 'true');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }


  logOut():void{
    if(this.isLogged()){
      localStorage.removeItem("isLogged");
      this.router.navigate(["/login"])
    }
  }

  isLogged():boolean{
    return localStorage.getItem('isLogged') === 'true';
  }
}

