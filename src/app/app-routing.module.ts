import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { SercurityService } from './Services/sercurity.service';
import { DocComponent } from './Components/doc/doc.component';
import { StatesComponent } from './Components/states/states.component';
import { GraphicsComponent } from './Components/graphics/graphics.component';

const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'dashboard',component: DashboardComponent,canActivate:[SercurityService], children:[
    {path:'inicio',component:DocComponent},
    {path:'estados',component:StatesComponent},
    {path:'graphic',component:GraphicsComponent}
  ]},
  {path:'**', redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
