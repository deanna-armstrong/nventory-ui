import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Http interceptor that injects the JWT Authorization header into outgoing HTTP requests.
 * Checks for a token in localStorage and, if present, clones the request to include the header.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Attempt to read the stored JWT token
  const token = localStorage.getItem('token');

  // If a token exists, clone the request and set the Authorization header
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Attach the token as a Bearer token
        },
      })
    : req; // Otherwise, leave the request unmodified

  // Pass the (potentially modified) request to the next handler in the chain
  return next(authReq);
};
