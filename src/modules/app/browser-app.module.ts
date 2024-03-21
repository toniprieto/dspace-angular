import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import {
  APP_ID,
  makeStateKey,
  NgModule,
  TransferState,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import {
  Action,
  StoreConfig,
  StoreModule,
} from '@ngrx/store';
import { REQUEST } from '../../express.tokens';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Angulartics2GoogleTagManager,
  Angulartics2RouterlessModule,
} from 'angulartics2';

import { AppComponent } from '../../app/app.component';
import { AppModule } from '../../app/app.module';
import { storeModuleConfig } from '../../app/app.reducer';
import { AuthService } from '../../app/core/auth/auth.service';
import { AuthRequestService } from '../../app/core/auth/auth-request.service';
import { BrowserAuthRequestService } from '../../app/core/auth/browser-auth-request.service';
import { coreEffects } from '../../app/core/core.effects';
import { coreReducers } from '../../app/core/core.reducers';
import { CoreState } from '../../app/core/core-state.model';
import { LocaleService } from '../../app/core/locale/locale.service';
import { BrowserReferrerService } from '../../app/core/services/browser.referrer.service';
import {
  BrowserHardRedirectService,
  locationProvider,
  LocationToken,
} from '../../app/core/services/browser-hard-redirect.service';
import { ClientCookieService } from '../../app/core/services/client-cookie.service';
import { CookieService } from '../../app/core/services/cookie.service';
import { HardRedirectService } from '../../app/core/services/hard-redirect.service';
import { ReferrerService } from '../../app/core/services/referrer.service';
import { ClientMathService } from '../../app/core/shared/client-math.service';
import { MathService } from '../../app/core/shared/math.service';
import { BrowserKlaroService } from '../../app/shared/cookies/browser-klaro.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';
import { MissingTranslationHelper } from '../../app/shared/translate/missing-translation.helper';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { SubmissionService } from '../../app/submission/submission.service';
import { TranslateBrowserLoader } from '../../ngx-translate-loaders/translate-browser.loader';
import { BrowserInitService } from './browser-init.service';

export const REQ_KEY = makeStateKey<string>('req');

export function createTranslateLoader(transferState: TransferState, http: HttpClient) {
  return new TranslateBrowserLoader(transferState, http, 'assets/i18n/', '.json');
}

export function getRequest(transferState: TransferState): any {
  return transferState.get<any>(REQ_KEY, {});
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    HttpClientModule,
    // forRoot ensures the providers are only created once
    Angulartics2RouterlessModule.forRoot(),
    BrowserAnimationsModule,
    StoreModule.forFeature('core', coreReducers, storeModuleConfig as StoreConfig<CoreState, Action>),
    EffectsModule.forFeature(coreEffects),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [TransferState, HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
      useDefaultLang: true,
    }),
    AppModule,
  ],
  providers: [
    ...BrowserInitService.providers(),
    { provide: APP_ID, useValue: 'dspace-angular' },
    {
      provide: REQUEST,
      useFactory: getRequest,
      deps: [TransferState],
    },
    {
      provide: AuthService,
      useClass: AuthService,
    },
    {
      provide: CookieService,
      useClass: ClientCookieService,
    },
    {
      provide: KlaroService,
      useClass: BrowserKlaroService,
    },
    {
      provide: SubmissionService,
      useClass: SubmissionService,
    },
    {
      provide: LocaleService,
      useClass: LocaleService,
    },
    {
      provide: HardRedirectService,
      useClass: BrowserHardRedirectService,
    },
    {
      provide: GoogleAnalyticsService,
      useClass: GoogleAnalyticsService,
    },
    {
      provide: Angulartics2GoogleTagManager,
      useClass: Angulartics2GoogleTagManager,
    },
    {
      provide: AuthRequestService,
      useClass: BrowserAuthRequestService,
    },
    {
      provide: ReferrerService,
      useClass: BrowserReferrerService,
    },
    {
      provide: LocationToken,
      useFactory: locationProvider,
    },
    {
      provide: MathService,
      useClass: ClientMathService,
    },
  ],
})
export class BrowserAppModule {
}
