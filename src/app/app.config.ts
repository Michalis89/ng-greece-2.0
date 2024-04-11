import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './state/app.state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FloodsDataService } from './services/floods/floods-data.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      NgxsModule.forRoot([AppState]),
      HttpClientModule,
      DatePipe,
      CustomDatePipe,
      NgxsLoggerPluginModule.forRoot()
    ),
    provideAnimationsAsync(),
    FloodsDataService,
  ],
};
