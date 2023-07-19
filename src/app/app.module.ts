import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { DocComponent } from './Components/doc/doc.component';

const dbConfig: DBConfig ={
  name : 'testDb',
  version : 1,
  objectStoresMeta :[{
    store: 'dataFile',
    storeConfig :{keyPath:'id', autoIncrement: false},
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
    DocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxIndexedDBModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
