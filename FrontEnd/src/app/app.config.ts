import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor'; // Adjust the path as necessary

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    FormsModule,
    BrowserAnimationsModule,
    importProvidersFrom(
      ToastrModule.forRoot()  // Import ToastrModule here
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Add the interceptor provider
  ]
};