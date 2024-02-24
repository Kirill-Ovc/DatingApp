import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers()
  {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members
      })
    )
  }

  getMember(username: string) : Observable<Member>
  {
    const member = this.members.find(m => m.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member)
  {
    return this.http.put(this.baseUrl + 'users', member);
  }

  // we have interceptor
  // getHttpOptions()
  // {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: {
  //       Authorization: 'Bearer ' + user.token
  //     }
  //   }
  // }
}
