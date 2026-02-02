import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideState, provideStore} from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import {DB_CONFIG_FEATURE_KEY, dbConfigReducer} from './+state/db-config/db-config.reducer';
import {DbConfigEffects} from './+state/db-config/db-config.effects';
import {provideHttpClient} from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { VIEW_FEATURE_KEY, viewReducer } from './+state/view/view.reducer';
import { ViewEffects } from './+state/view/view.effects';
import { RELATIONS_FEATURE_KEY, relationsReducer } from './+state/relations/relations.reducer';
import { RelationsEffects } from './+state/relations/relations.effects';
import { MainEffects } from './+state/main/main.effects';
import { MAIN_FEATURE_KEY, mainReducer } from './+state/main/main.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideStore(),
    provideState(DB_CONFIG_FEATURE_KEY, dbConfigReducer),
    provideState(RELATIONS_FEATURE_KEY, relationsReducer),
    provideState(VIEW_FEATURE_KEY, viewReducer),
    provideState(MAIN_FEATURE_KEY, mainReducer),
    provideEffects(DbConfigEffects, ViewEffects, RelationsEffects, MainEffects),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideRouterStore(),
    // provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
