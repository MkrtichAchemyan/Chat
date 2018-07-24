import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { LoginRegistPageComponent } from './login-regist-page/login-regist-page.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommonService} from "./login-regist-page/common.service";
import { ChatPageComponent } from './chat-page/chat-page.component';
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './login/login.component';
import {CommonLoginService} from "./login/commonLogin.service";
import {CommonChatService} from "./chat-page/commonChat.service";
import {AuthGuard} from "./auth-guard.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ScrollDirective } from './directives/scroll.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginRegistPageComponent,
    ChatPageComponent,
    LoginComponent,
    ScrollDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [
    CommonService,
    CommonLoginService,
    CommonChatService,
    AuthGuard
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
