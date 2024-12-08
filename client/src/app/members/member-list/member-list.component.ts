import { Component, OnInit, inject } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
    standalone: true,
    imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule]
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor() { }

  ngOnInit(): void {
    if (!this.memberService.paginatedResult()) {
      this.loadMembers();
    } 
  }

  loadMembers() {
    this.memberService.getMembers();
  }

  resetFilters(){
    this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any){
    if (this.memberService.userParams().pageNumber !== event.page){
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}
