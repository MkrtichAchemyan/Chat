import {Directive, ElementRef, HostListener, Inject, ViewChild} from '@angular/core';
import {CommonChatService} from "../chat-page/commonChat.service";
import {DOCUMENT} from "@angular/common";
import {ChatPageComponent} from "../chat-page/chat-page.component";

@Directive({
  selector: '[scroll-directive]',
})
export class ScrollDirective{
  @Inject(DOCUMENT) document;
  @ViewChild('UserL') UserL:ElementRef
  constructor(private newService: CommonChatService, private chatComponent: ChatPageComponent) {}
  x;
  bool;
  //h;
  @HostListener("scroll", ["$event"])
  onListenerTriggered(event: UIEvent): void {

    // if(this.bool) {
    //
    //    console.log(this.h, "+++++");
    //    this.bool = false;
    //  }
    if (event.srcElement.scrollTop  === 0) {
      this.bool = true;
      document.getElementById("loading").style.visibility = "visible"
      this.newService.scrolling().subscribe( data =>{
        for (let i = data["msgs"].length-1; i >=0 ; i-- ) {
           this.chatComponent.Message.unshift(data["msgs"][i]);
         };
      //console.dir(event.srcElement);
       // document.getElementById("loading").style.visibility = "hidden";
          //console.log(data["msgs"][data["msgs"].length -1].uniqueId)
           //this.x = document.getElementById("aaa" + ( data["msgs"][data["msgs"].length - 1].uniqueId+1));
      //console.dir(this.x)
        //this.h = document.getElementById('UserL').scrollTop;
        console.log(event.srcElement.scrollTop);
        event.srcElement.scrollTop = 100;
        console.log(event.srcElement.scrollTop);

        //console.log(this.chatComponent.Message)
      })
    }
  }
  // ngAfterViewInit() {
  //   this.x.scrollIntoView();
  // }

}
