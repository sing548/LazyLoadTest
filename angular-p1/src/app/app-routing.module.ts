import { NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { of } from 'rxjs';
import { ModuleFederationService } from './services/module-federation.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  moduleConfig: any[] = [{
    "version": "0.1.0",
    "enabled": true,
    "remoteEntry": "http://localhost:50418/remoteEntry.js",
    "remoteName": "p2",
    "lazyModules": [
        {
            "path": "p2",
            "exposedModule": "./P2",
            "exposedModuleName": "P2Module"
        }
    ],
    "eagerModules": [
        {
            "exposedModule": "./Startup",
            "exposedModuleName": "StartupModule"
        }
    ]
}];

  additionalRoutes: Route[] = [];
  constructor(router: Router, federationService: ModuleFederationService) {
    of(true).subscribe((x: any) => {
      federationService.loadRemoteFeatures(
        this.moduleConfig,
        this.additionalRoutes
      );
    })
  }
 }
