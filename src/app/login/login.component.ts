import { Component, OnInit, Renderer2 } from '@angular/core';
import { StarWarService } from '../starwar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  notStarWar: boolean = false;
  loginForm: FormGroup;
  submitted = false;

  constructor(private renderer: Renderer2, private service: StarWarService, private router: Router, private formBuilder: FormBuilder) {
    //add class to body when login component is created
    this.renderer.addClass(document.body, 'login');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  //on logging In
  onLogin() {
    this.submitted = true;
    let loginData;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.service.onLogin(this.loginForm.value).subscribe(data => {
      loginData = data['results'];
      if (loginData.length && this.loginForm.value.username === loginData[0].name && this.loginForm.value.password === loginData[0].birth_year) {
        this.router.navigate(['search', this.loginForm.value.username]);
        localStorage.setItem('user', this.loginForm.value.username)
      }
      else {
        this.notStarWar = true;
      }
    });
  }

  //class removed from body when component is destroyed/exited
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login');
  }
}
