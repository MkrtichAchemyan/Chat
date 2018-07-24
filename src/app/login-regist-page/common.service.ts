import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CommonService {

  constructor(private http: HttpClient) { }

  saveUser(user){
    return this.http.post('http://localhost:3000/register/', user)
  }

}

