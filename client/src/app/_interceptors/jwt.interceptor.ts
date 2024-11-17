import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor : HttpInterceptorFn = (request, next) => {
  const accountService = inject(AccountService);

  if (accountService.currentUser()) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`
      }
    })
  }

  return next(request);
}
