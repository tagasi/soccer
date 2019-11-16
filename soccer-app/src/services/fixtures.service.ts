import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from "rxjs";

@Injectable()
export class FixturesService {
    
    constructor(private http:HttpClient){}

    getFixtures(): Observable<any> {
                
        return this.http.get<any>('/api/results');

    }
}