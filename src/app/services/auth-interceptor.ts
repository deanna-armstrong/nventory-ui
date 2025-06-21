import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * AuthInterceptor
 *
 * Intercepts outgoing HTTP requests to attach a JWT Authorization header
 * when a token is present in localStorage.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Intercepts an outgoing HTTP request.
   *
   * @param req - The outgoing HTTP request instance
   * @param next - Handler to forward the (possibly modified) request
   * @returns An Observable of the HTTP event stream
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Attempt to retrieve the JWT token from localStorage
    const token = localStorage.getItem('token');

    // If a token exists, clone the request and add the Authorization header
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Attach as Bearer token
        }
      });
      // Pass the cloned request instead of the original
      return next.handle(authReq);
    }

    // If no token, simply forward the original request unchanged
    return next.handle(req);
  }
}
