import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-test-error',
    templateUrl: './test-error.component.html',
    styleUrls: ['./test-error.component.css'],
    standalone: true,
    imports: [NgIf, NgFor]
})
export class TestErrorComponent {
  baseUrl = 'https://localhost:5001/api/';
  validationErrors: string[] = [];

  constructor(private http: HttpClient)
  {
  }

  get500Error()
  {
      this.http.get(this.baseUrl + 'users/server-error').subscribe({
        next: response => console.log(response),
        error: error => console.log(error),
      });
  }

  get404Error()
  {
      this.http.get(this.baseUrl + 'account/notfound-error').subscribe({
        next: response => console.log(response),
        error: error => console.log(error),
      });
  }

  get401Error()
  {
      this.http.get(this.baseUrl + 'users/401-error').subscribe({
        next: response => console.log(response),
        error: error => console.log(error),
      });
  }

  getValidationError()
  {
      this.http.post(this.baseUrl + 'account/register', {}).subscribe({
        next: response => console.log(response),
        error: error => {
          console.log(error);
          this.validationErrors = error;
        }
      });
  }

}
