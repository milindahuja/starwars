import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StarWarService } from '../starwar.service';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchPlanet$ = new Subject<string>();
  results = [];
  searchCount = [];

  constructor(private renderer: Renderer2, private service: StarWarService, private activatedRoute: ActivatedRoute ) {
    //add class to body when login component is created
    this.renderer.addClass(document.body, 'search');
    
    //get the current/logged In user from route params
    let params: any = this.activatedRoute.snapshot.params;

    //search method called from service
    this.search(this.searchPlanet$,params.user)
    .subscribe(data => {
      this.results = data['results'];
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
      let time = 60000 - timeDifference;
      var input = (<HTMLInputElement>document.getElementById("search"));
      console.log("time starts");
      input.disabled = true;
      console.log("disabled");
      let currentTime = new Date().getTime();
      for (let i = 0; ; i++) {
        let currentTimeForLoop = new Date().getTime();
        if (currentTimeForLoop > currentTime + time) {
          console.log(currentTime);
          console.log(currentTimeForLoop);
          break;
        }
        else {
          continue;
        }
      }
      console.log("time end");
      input.disabled = false;
      this.searchCount = [];
      return this.service.getPlanets(planet);
    }
    else {
      return this.service.getPlanets(planet);
    }
  }

  ngOnInit() {
  }
  
  //class removed from body when component is destroyed/exited
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'search');
  }
}
