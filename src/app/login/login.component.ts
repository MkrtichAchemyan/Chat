import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {CommonLoginService} from "./commonLogin.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  email;
  password;
  emailSpan = "";
  passwordSpan = "";
  errorSpan = "";
  token;

  constructor(private route: ActivatedRoute, private newService: CommonLoginService, private router: Router, public http: HttpClient) {
  }

  ngOnInit() {
  };


  logIn(event, user) {
    this.newService.loginUser(user).subscribe(data => {

        if (data["message"] == undefined) {
          this.token = data["token"];
          if (this.token) {
            localStorage.setItem('Authorization', this.token);
            this.router.navigate(['/chat'])
          }
        }
      },
      error => {

        if (error['status'] == 403 && error.error.type == "confirm"){
            this.errorSpan = error.error.message
          return
        }
        else {
          this.errorSpan = ""
        }
        if (error['status'] == 403 && error.error.type == "email"){
          this.emailSpan = error.error.message
          return
        }
        else {
          this.emailSpan = ""
        }
        if (error['status'] == 403 && error.error.type == "password"){
          this.passwordSpan = error.error.message
          return
        }
        else {
          this.passwordSpan = ""
        }

      }
    )
  }
}
