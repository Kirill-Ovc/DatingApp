import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Observable, map, of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient); 
  private accounService = inject(AccountService);
  baseUrl = environment.apiUrl
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accounService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers()
  {
    const key = Object.values(this.userParams()).join('-');
    const response = this.memberCache.get(key); 

    if (response) return this.setPagindatedResponse(response);

    let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append("minAge", this.userParams().minAge);
    params = params.append("maxAge", this.userParams().maxAge);
    params = params.append("gender", this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params})
      .subscribe({
        next: response => {
          this.setPagindatedResponse(response);
          this.memberCache.set(key, response);
        }
      });
  }

  private setPagindatedResponse(response: HttpResponse<Member[]>){
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    })
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  getMember(username: string) : Observable<Member>
  {
    const member:Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), {})
      .find((m: Member) => m.username === username);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member)
      .pipe(tap(() => {
        this.updateMemberInCache(member);
      }));
  }

  private updateMemberInCache(member: Member) {
    this.memberCache.forEach((response: HttpResponse<Member[]>, key: string) => {
      const members = response.body as Member[];
      const index = members.findIndex((m: Member) => m.username === member.username);
      if (index !== -1) {
        members[index] = { ...members[index], ...member };
      }
    });
  }

  setMainPhoto(photo: Photo)
  {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}).pipe(
      // tap(() => {
      //   const member = this.members.find(m => m.photos.includes(photo));
      //   if (member) {
      //     member.photoUrl = photo.url;
      //   }
      // })
    );
  }

  deletePhoto(photo: Photo)
  {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
      // tap(() => {
      //   const member = this.members.find(m => m.photos.includes(photo));
      //   if (member) {
      //     member.photos = member.photos.filter(p => p.id !== photo.id)
      //   }
      // })
    );
  }
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

