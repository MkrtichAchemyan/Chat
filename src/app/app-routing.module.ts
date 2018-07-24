import {NgModule} from "@angular/core";
import {ChatPageComponent} from "./chat-page/chat-page.component";
import {LoginRegistPageComponent} from "./login-regist-page/login-regist-page.component";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth-guard.service";

const appRouts: Routes = [
  {path: "", component: LoginRegistPageComponent},
  {path: "login", component: LoginComponent},
  {path: "chat", component: ChatPageComponent, canActivate: [AuthGuard]},
  {path: "**", redirectTo: "/login"}
]
@NgModule({
  imports: [RouterModule.forRoot(appRouts)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
