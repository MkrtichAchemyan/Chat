import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';

@Injectable()
export class CommonLoginService {

  constructor(private http: HttpClient) {}

  loginUser(data){
    return this.http.post('http://localhost:3000/login/', data)
  }

}
