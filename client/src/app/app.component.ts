import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NgxSpinnerModule, NavComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'dating app';
  users: any;

  constructor(private accountService: AccountService) { }
  
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString){
      return;
    }
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
