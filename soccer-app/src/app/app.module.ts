import { HttpClient } from '@angular/common/http';
import { FixturesService } from './../services/fixtures.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [    
    FixturesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
