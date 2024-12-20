import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe, NgIf } from '@angular/common';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
    standalone: true,
    imports: [NgIf, TabsModule, FormsModule, PhotoEditorComponent, DatePipe, TimeagoModule]
})
export class MemberEditComponent implements OnInit {
  private accountService = inject(AccountService);
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['event']) unloadNotification($event: any){
    if (this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  user = this.accountService.currentUser();
  member: Member | undefined;
  
  constructor(private memberService: MembersService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if (!this.user){
      return;
    }
    this.memberService.getMember(this.user.username).subscribe({
      next: m => this.member = m
    });
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    });
  }

  onMemberChanged(event: Member){
    this.member = event;
  }
}
