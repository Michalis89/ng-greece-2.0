import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './state/app.state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FloodsDataService } from './services/floods/floods-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgxsModule.forRoot([AppState])),
    provideAnimationsAsync(),
    FloodsDataService,
  ],
};
