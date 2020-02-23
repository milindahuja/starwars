import { Component, OnInit, Renderer2  } from '@angular/core';
import { StarWarService } from '../starwar.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  notStarWar: boolean = false;

  constructor(private renderer: Renderer2, private service: StarWarService, private router: Router) {
    //add class to body when login component is created
    this.renderer.addClass(document.body, 'login');
   }

  ngOnInit() {
  }

  //on logging In
  onLogin(username, password) {
    let loginData;
    this.service.onLogin(username,password).subscribe(data => {
			loginData = data['results'];
			if(loginData.length && username===loginData[0].name && password===loginData[0].birth_year){
				this.router.navigate(['search',username]);  
			}
			else{
				this.notStarWar = true;
			}
		});
  }

  //class removed from body when component is destroyed/exited
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login');
  }
}
