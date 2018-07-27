import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as io from "socket.io-client";
import {Observable} from "rxjs/index";

@Injectable()
export class CommonChatService {

  constructor(private http: HttpClient ) { };
  token = localStorage.getItem("Authorization");
  h = new HttpHeaders().set('authorization', this.token);
  private socket = io.connect("http://localhost:8000");
  GetData(){
    return this.http.get('http://localhost:3000/chat', {headers: this.h})
  }

  changeAvatar(avatar){
    return this.http.post('http://localhost:3000/changeAvatar', {"img":avatar}, {headers: this.h})
  }

  sendMessage(data){
    return this.socket.emit("message",data)
  }

  messageRes(){
    let observable = new Observable(observer => {
      this.socket.on('newMessage', (data) => {
        observer.next(data);
      })
    });
    return observable
  }
  setOnline(){
    let observable = new Observable(observer => {
      this.socket.on('setOnline', (data) => {
        observer.next(data);
      })
    });
    return observable
  }

  setOffline(){
    let observable = new Observable(observer => {
      this.socket.on('setOffline', (data) => {
        observer.next(data);
      })
    });
    return observable
  }

  userConnected(data){
    return this.socket.emit("userConnected", data)
  }

  userDisconected(data){
    return this.socket.emit("userDisconnect", data)
  }

  destroy(user){
    return this.http.post('http://localhost:3000/destroy', user)
  }

  scrolling(){
    return this.http.get('http://localhost:3000/loadNextMessages')
  }



}
