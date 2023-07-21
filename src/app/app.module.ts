import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { DocComponent } from './Components/doc/doc.component';
import { StatesComponent } from './Components/states/states.component';
import { GraphicsComponent } from './Components/graphics/graphics.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogModule } from '@angular/material/dialog';

const dbConfig: DBConfig ={
  name : 'testDb',
  version : 2,
  objectStoresMeta :[{
    store: 'dataFile',
    storeConfig :{keyPath:'id', autoIncrement: true},
    storeSchema:[
      {name:'data',keypath:'data',options:{unique:false}}
    ]
  }]
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DocComponent,
    StatesComponent,
    GraphicsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
