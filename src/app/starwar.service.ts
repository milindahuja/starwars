import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StarWarService {


  loginQueryUrl: string = 'people/?search=';
  searchQueryUrl: string = 'planets/?search=';

  searchCount = [];

  constructor(private http: HttpClient) { }

  // onLogin service accepting user and password parameter
  onLogin(user, password) {
    return this.http.get(environment.apiUrl + this.loginQueryUrl + user)
  }

  getPlanets(planet) {
    return this.http.get(environment.apiUrl + this.searchQueryUrl + planet)
  }
}
