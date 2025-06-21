import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// provideRouter sets up the Angular router with your application’s route definitions
import { provideRouter } from '@angular/router';
// provideHttpClient configures the built-in HttpClient, here using fetch API and adding your auth interceptor
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// provideClientHydration enables hydration for server-rendered apps, replaying browser events after bootstrapping
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
// Your custom HTTP interceptor to attach JWT tokens to outgoing requests
import { authInterceptor } from './auth/auth-interceptor';

/**
 * Global application configuration for standalone bootstrap.
 * Registers framework and application providers to:
 * - Wire up HttpClient with fetch and interceptor support
 * - Optimize change detection with event coalescing
 * - Initialize the router with your route definitions
 * - Enable client-side hydration with event replay after server render
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configure HttpClient to use the Fetch API plus your authInterceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),

    // Enable zone.js change detection optimizations by coalescing multiple events
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Initialize the router with the application's route definitions
    provideRouter(routes),

    // Set up client-side hydration to replay user events after server rendering
    provideClientHydration(withEventReplay())
  ]
};
