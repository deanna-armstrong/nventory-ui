import { bootstrapApplication } from '@angular/platform-browser';
// Core function to bootstrap a standalone Angular application without NgModule

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
// Configures the built-in HttpClient with optional fetch polyfill and interceptor support

import { provideRouter } from '@angular/router';
// Sets up the Angular router with your route definitions

import { AppComponent } from './app/components/app.component';
// Root component of the application, defines the overall app shell

import { appConfig } from './app/app.config';
// Global application providers (HTTP, router, hydration, change detection)

import { routes } from './app/app.routes';
// Your application’s route definitions mapping paths to components

import { authInterceptor } from './app/auth/auth-interceptor';
// HTTP interceptor that attaches the JWT token to outgoing requests

// Bootstrap the Angular application with standalone components and providers
bootstrapApplication(AppComponent, {
  providers: [
    // Initialize the router with the defined routes
    provideRouter(routes),

    // Configure HttpClient to include the authInterceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Spread in additional providers (e.g., zone optimizations, hydration)
    ...appConfig.providers
  ]
})
// Log any bootstrap errors to the console for debugging
.catch(err => console.error('Bootstrap error:', err));
