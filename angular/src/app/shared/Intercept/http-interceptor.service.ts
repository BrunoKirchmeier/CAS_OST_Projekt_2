import { Injectable } from '@angular/core';
import { HttpEvent,
         HttpInterceptor,
         HttpHandler,
         HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IScryfallApiResList } from '../services/scryfallApi.service';

@Injectable({
  providedIn: 'root'
})

export class HttpInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<IScryfallApiResList>> {
    return next.handle(request).pipe(
      debounceTime(500),
    )}
}
