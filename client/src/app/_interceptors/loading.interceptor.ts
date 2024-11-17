import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const loadingInterceptor : HttpInterceptorFn = (request, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  return next(request).pipe(
    delay(1000),
    finalize(() => {
      busyService.idle();
    })  
  );
}
