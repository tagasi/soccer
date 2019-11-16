import { Component } from '@angular/core';
import { FixturesService } from './../services/fixtures.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  fixtures=[];
  constructor(private service : FixturesService){}

  ngOnInit() {
    this.service.getFixtures().toPromise().then(
      (value)=>{
        this.fixtures = value;
        console.log(this.fixtures);
      },
      (err)=>{
        console.log(err);
      }
    );
  }
}
