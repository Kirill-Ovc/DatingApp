import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user){
          this.setCurrentUser(user);
        };
        return user;
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  checkCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString){
      return;
    }
    const user: User = JSON.parse(userString);
    this.currentUser.set(user);
  }

  setCurrentUser(user: User)
  {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
