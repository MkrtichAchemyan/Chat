import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonChatService} from './commonChat.service';
import {Router} from '@angular/router';
import {NgbDropdownConfig, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, AfterViewInit {
  @Inject(DOCUMENT) document;
  @ViewChild('MessagesScroll') MessagesScroll: ElementRef;
  bool = true;
  Users;
  User = [];
  token;
  message = '';
  Message = [];
  smiles = [
    '😀', '😂', '😃', '😅', '😇', '😉', '😊', '🙂', '🙃', '💋', '😋', '😍', '😘', '😗', '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😒', '🙄', '🤔', '😟', '😠', '😡', '😔', '😫', '😩', '😤', '😱', '😱', '😰', '😢', '😭', '🤐', '😷', '🤒', '🤕', '😴', '💩', '😈', '👍', '👎', '👏', '👌', '💪'
  ];
  animals = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐯', '🦁', '🐮', '🐷', '🐸', '🙈', '🙉', '🙊', '🐣', '🐥', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🐌', '🐞', '🐜', '🕷', '🦂', '🦀', '🐍', '🐢', '🐠', '🐟', '🐬', '🐳', '🐊', '🐘', '🕊', '🐿', '🎄', '🌳', '🌴', '🌺', '🌻', '🌸', '🦋', '☃', '🌞', '☔', '❄',
  ];
  foods = [
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🥝', '🍑', '🍍', '🍅', '🥒', '🍆', '🌶', '🌽', '🍯', '🍞', '🧀', '🍗', '🍖', '🍳', '🍔', '🍟', '🌭', '🍕', '🍜', '🍲', '🍱', '🍧', '🍦', '🍰', '🎂', '🍭', '🍫', '🍩', '🍺', '🍷', '🍸', '🍹', '🍾', '☕', '🍽', '🥐', '🥗', '🥕', '🥪', '🍿'
  ];
  proffesion = [
    '👩🏻‍🎓', '👨🏻‍🎓', '👲🏻', '👷🏻', '👸🏻', '🎅🏻', '👮🏻', '💂🏻', '💇🏻', '💃', '🏃', '👨🏻‍🏫', '👨🏻‍🌾', '👨🏻‍🍳', '👩🏻‍🍳', '👨🏻‍🔧', '👩🏻‍🔧', '👨🏼‍🏭', '👩🏼‍🏭', '👨🏻‍🔬', '👩🏼‍🔬', '👨🏻‍💻', '👩🏻‍💻', '👨🏻‍🎤', '👩🏻‍🎤', '👨🏻‍🎨', '👩🏻‍🎨', '👨🏻‍✈️', '👩🏻‍✈️', '👨🏻‍🚀', '👩🏻‍🚀', '👨🏻‍🚒', '👩🏻‍🚒', '👮🏻‍️', '👮🏻‍️', '🕵🏻', '🕵🏻‍️', '👷🏻‍️', '💇🏻‍️', '🤶🏼', '👨🏻‍⚖️', '👩🏼‍⚖️', '💂🏻‍️', '🤵🏻', '🤰🏼', '💆🏽', '💆🏻‍️', '🕺🏻', '🏃🏼‍️', '👰🏻', '🤡'
  ];
  sports = [
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '⛳', '🏌', '🏓', '🏸', '🏒', '🏑', '🏏', '🎿', '⛷', '🏂', '⛸', '🏹', '🎣', '🚣', '🏊', '🏄', '⛹', '🏋', '🚴', '🚵', '🏇', '🕴', '🏆', '🎽', '🏅', '🎖', '🎭', '🎨', '🎪', '🎲', '🎰', '🎳', '🎹', '🎷', '🎺', '🎸', '🎻', '🎤', '🎧', '🎯', '🎮', '🤹‍', '🤾‍'
  ];

  constructor(private tabs: NgbTabsetConfig, private config: NgbDropdownConfig, private newService: CommonChatService, private router: Router) {


    config.autoClose = false;
    tabs.justify = 'center';

    this.newService.messageRes().subscribe(data => {
      this.Message.push(data);
    });

    this.newService.setOffline().subscribe(data => {
      console.log(data);
      document.getElementById(data['userId']).style.border = 'solid red';
    });
    this.newService.setOnline().subscribe(data => {
      console.log(data);
      document.getElementById(data['userId']).style.border = 'solid green';
    });
  }

  del(ind, id) {
    this.newService.deleteMesage(id).subscribe(data => {
      this.Message.splice(ind,1);
      console.log('-------------------------');
      console.log(id);
    })
  }


  ngOnInit() {
    this.newService.GetData().subscribe(data => {
      this.Users = data['users'];
      this.User.push(data['user']);
      this.Message = data['messages'];
      console.log(this.Message);
      this.newService.userConnected({userId: this.User[0]._id});
      console.log(this.Message.length);
      setTimeout(() => {
        this.MessagesScroll.nativeElement.scrollTop = this.MessagesScroll.nativeElement.scrollHeight;
      }, 100);

    }, error => {
      if (error.status == 400) {
        console.log(error);
        localStorage.removeItem('Authorization');
        this.router.navigate(['/login']);
      }
    });
  }

  search(event) {
    this.newService.searchUser(event.target.value).subscribe((data) => {
      this.Users = data['users'];
    });
  }

  onSave(event) {

    console.log(event);
    var file = event.target.files[0];
    console.log(file);
    var reader = new FileReader();
    var newAvatar;
    var promise = new Promise((resolve, reject) => {
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.addEventListener('load', function () {
        newAvatar = reader.result;
        resolve('done');
      }, false);

    }).then((val) => {

      this.newService.changeAvatar({
        data: newAvatar,
        ext: file.type
      }).subscribe(data => {
        this.User[0] = data['user'];
        //console.log(this.User, "++++++++++++++++++++++++========================================")
        // this.User.push(data["user"]);
        console.log(data, '-------------------//////////////**************++++++++++++++++--------------------');
      });
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    const promise = new Promise((resolve, reject) => {
      this.newService.destroy({userId: this.User[0]._id}).subscribe(data => {
        resolve(data);
      });
    }).then((data) => {
      this.router.navigate(['/chat']);
      console.log(data);
    });
  }

  logOut() {
    this.newService.userDisconected({userId: this.User[0]._id});
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }


  send() {
    this.bool = true;
    if (this.message === '') return;
    this.newService.sendMessage({message: this.message, user: this.User[0]._id, avatar: this.User[0].avatar});
    setTimeout(() => {
      this.MessagesScroll.nativeElement.scrollTop = this.MessagesScroll.nativeElement.scrollHeight;
    }, 100);
    this.message = '';
  }

  take(event) {
    this.bool = true;
    this.message += event.target.innerHTML;
  }
  room(event){
    console.log(event)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.MessagesScroll.nativeElement.scrollTop = this.MessagesScroll.nativeElement.scrollHeight;
    }, 100);

  }

}
