import {Component, OnInit} from '@angular/core';
import {CommonService} from "./common.service";
import * as base64 from "base64-img";
import {reject} from "q";


@Component({
  selector: 'app-login-regist-page',
  templateUrl: './login-regist-page.component.html',
  styleUrls: ['./login-regist-page.component.css']
})
export class LoginRegistPageComponent implements OnInit {
  Emails
  registusername;
  registpassword;
  cpassword;
  email;
  img;
  spanUsername = "";
  spanEmail = "";
  spanPassword = "";
  spanCpassword = "";
  spanImg = "";
  saveStatus = false;
  serverErrSpan = "";



  constructor(private newService: CommonService) {

  }


  ngOnInit() {  }

  onSave = function (event,user) {

    if (this.registusername === undefined) {
      this.spanUsername = "Please, fill out this field";
      return;
    } else {
      this.spanUsername = "";
    }
    if (this.email === undefined) {
      this.spanEmail = "Please, fill out this field";
      return;
    } else {
      this.spanEmail = "";
    }
    // if (this.Emails.indexOf(this.email) !== -1) {
    //   this.spanEmail = "Email address already exists";
    //   return;
    // } else {
    //   this.spanEmail = "";
    // }


    var validateEmail = function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
    };
    var validatePassword = function (password) {
      var repass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      return repass.test(password)
    };

    if (!validateEmail(event.target[2].value)) {
      this.spanEmail = "No valid Email";
      return;
    } else {
      this.spanEmail = "";
    }

    if (this.registpassword === undefined) {
      this.spanPassword = "Please, fill out this field";
      return;
    } else {
      this.spanPassword = "";
    }
    if (!validatePassword(event.target[3].value)) {
      this.spanPassword = "No valid Password";
      return;
    } else {
      this.spanPassword = "";
    }

    if (this.cpassword === undefined) {
      this.spanCpassword = "Please, fill out this field";
      return;
    } else {
      this.spanCpassword = "";
    }

    if (this.registpassword !== this.cpassword) {
      this.spanCpassword = "Password and confirm password is not equaled";
      return
    }
    else {
      this.spanCpassword ="";
    }
    var user;

    if (this.img === undefined) {
       user = {
        registusername: event.target[1].value,
        email: event.target[2].value,
        registpassword: event.target[3].value,
        img: ""
      }
      this.newService.saveUser(user).subscribe(data => {
          console.log(data)
        localStorage.setItem("tokenEmail",data)

          this.registusername = "";
          this.registpassword= "";
          this.cpassword= "";
          this.email= "";
          this.img= "";
          this.saveStatus = true;

        }
        , error => {
          if(error.status == 400) {
            console.log(error.error["message"]);
            this.spanEmail = error.error["message"];
            this.saveStatus = false;
            return;
          }
          if(error.status == 500) {
            console.log(error.error["error"]);
            this.serverErrSpan = error.error["error"];
            this.saveStatus = false;
          }

        });
    }
    else {
      var pattern = /image-*/;
      var file = event.target[5].files[0];
      console.log(file)
      var reader = new FileReader();
      console.log(reader)
      var newImg
      var promise = new Promise((resolve, reject) => {
        reader.addEventListener("load", function () {
          newImg = reader.result;
          console.log(user)
          resolve("done")
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        }

        if (!file.type.match(pattern)) {
          reject("File is not an image")
        }

      })
      promise.then(
        (val) => {
          this.spanImg = ""

          user = {
            registusername: event.target[1].value,
            email: event.target[2].value,
            registpassword: event.target[3].value,
            img: {
              data: newImg,
              ext: file.type
            }
          }
          console.log(user)


          this.newService.saveUser(user).subscribe(data => {
              console.log(data)
              this.registusername = "";
              this.registpassword= "";
              this.cpassword= "";
              this.email= "";
              this.img= "";
              this.saveStatus = true;

            }
            , error => {
              if(error.status == 400) {
                console.log(error.error["message"]);
                this.spanEmail = error.error["message"];
                this.saveStatus = false;
                return;
              }
              if(error.status == 500) {
                console.log(error.error["error"]);
                this.serverErrSpan = error.error["error"];
                this.saveStatus = false;
              }

            });
        }
      )
        .catch((err)=>{
          console.log("******************************")
          this.spanImg = "File is not an image"
        })
    }
  }
}
