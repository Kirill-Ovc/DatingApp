import { Component, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css'],
    standalone: true
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;

  ngOnInit() {
    // Runtime check to ensure input is provided
    if (!this.member) {
      throw new Error('Member input is required.');
    }
  }
}
