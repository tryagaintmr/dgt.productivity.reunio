import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContextService } from './shared/services/context.service';
import { APP_BASE_HREF } from '@angular/common';
import { GlobalErrorHandlerService } from './shared/services/logger/global-error-handler.service';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { HttpMockRequestInterceptorService } from './shared/services/interceptor/http-mock-request-interceptor.service';
import { PageErrorComponent } from './shared/pages/page-error/page-error.component';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { environment } from '@/environments/environment';
import { MeetingProposalService } from './reunio/services/meeting-proposal.service';
import { MeetingProposalMockService } from './reunio/mock/meeting-proposal-mock.service';


export const isMock = environment.mock;
// tslint:disable-next-line: ban-types
// export function startupServiceFactory(contextService: ContextService): Function {
//   return async () => await contextService.load();
// }


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PageErrorComponent
  ],
  imports: [
    CoreModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: isMock ? HttpMockRequestInterceptorService : HttpMockRequestInterceptorService,
      multi: true
    },
    {
      provide: APP_BASE_HREF, useValue: '.'
    },
    // ContextService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: startupServiceFactory,
    //   deps: [ContextService],
    //   multi: true
    // },
    // Add both services to the providers array
    { provide: MeetingProposalService, useClass: MeetingProposalService },
    { provide: MeetingProposalMockService, useClass: MeetingProposalMockService },
    // Add a configuration value to determine which service to use
    { provide: 'useMockService', useValue: false },
    // Add the UserService interface to the providers array
    { provide: MeetingProposalService, useExisting: process.env['NODE_ENV'] === 'production' ? MeetingProposalService : MeetingProposalMockService }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
