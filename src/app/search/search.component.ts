import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StarWarService } from '../starwar.service';
import { switchMap, debounceTime, distinctUntilChanged, delay } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchPlanet$ = new Subject<string>();
  results = [];
  searchCount = [];
  limitReached: boolean;
  largerPopulation: any;

  constructor(private renderer: Renderer2, private service: StarWarService, private activatedRoute: ActivatedRoute, private router: Router) {
    //add class to body when login component is created
    this.renderer.addClass(document.body, 'search');
    this.limitReached = false;
    //get the current/logged In user from route params
    let params: any = this.activatedRoute.snapshot.params;

    //search method called from service
    this.search(this.searchPlanet$, params.user)
      .subscribe(data => {
        this.results = data['results'].filter(e => e.population !== "unknown");
        this.largerPopulation = Math.max(...this.results.map(({ population }) => population));
      });
  }

  // search service method accepting searched planets and logged user as parameter
  search(planets: Observable<string>, user) {
    return planets.pipe(debounceTime(400)
      , distinctUntilChanged()
      , switchMap(planet => this.searchPlanets(planet, user)));
  }

  // search for planets according to user permissions 
  // (Only the user Luke Skywalker should be able to make more than 15 searches in a minute.)
  searchPlanets(planet, user) {
    let start = new Date().getTime();
    this.searchCount.push(start);
    let cLength = this.searchCount.length;
    let timeDifference = parseInt(this.searchCount[cLength - 1]) - parseInt(this.searchCount[cLength - 14]);
    if (user !== "Luke Skywalker" && (cLength >= 15 && timeDifference <= 60000)) {  
      this.limitReached = true;
      this.results = [];
      setTimeout( () => {
        this.limitReached = false;
        this.searchCount = [];
      }, 30000);
      return this.service.getPlanets(planet).pipe(delay(30000));
    }
    else {
      return this.service.getPlanets(planet);
    }
  }

  onLogout() {
    localStorage.removeItem("user");
    this.router.navigate(['login']);

  }

  ngOnInit() {
    if (localStorage.getItem("user") === null){
      this.router.navigate(['login']);
    }
  }

  //class removed from body when component is destroyed/exited
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'search');
  }
}
