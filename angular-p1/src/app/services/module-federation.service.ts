import {
  loadRemoteModule,
  LoadRemoteModuleOptions,
} from "@angular-architects/module-federation";
import { Compiler, Injectable, Injector } from "@angular/core";
import { Route, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class ModuleFederationService {
  public loadedModules: any[] = [];
  public loadedModules$: Observable<any[]>;
  constructor(private router: Router, private compiler: Compiler, private injector: Injector) {
    this.loadedModules$ = of([]);
  }

  public loadRemoteFeatures(features: any[], additionalRoutes: Route[]) {
    const modulesArray = features.map((x) => {
      return x.eagerModules.map((mod: any) => {
        return {
          version: x.version,
          remoteEntry: x.remoteEntry,
          remoteName: x.remoteName,
          exposedModule: mod.exposedModule,
          exposedModuleName: mod.exposedModuleName,
        } as any;
      });
    });

    let preLoadModules: any[] = [];
    preLoadModules = preLoadModules.concat.apply([], modulesArray);
    const timestamp = Date.now();
    Promise.all(preLoadModules.map((m) => this.loadRemoteModuleDirect(m))).then(
      async (modules) => {
        console.log("Modules loaded in: ", Date.now() - timestamp, "ms");
        const routesArray = features.map((x) => {
          return (x.lazyModules as any[]).map((mod) => {
            return {
              path: mod.path,
              loadChildren: () => {
                var options: LoadRemoteModuleOptions = {
                  ...(x.remoteName
                    ? { remoteName: x.remoteName }
                    : { type: "module" }),
                  remoteEntry: `${x.remoteEntry}`,
                  exposedModule: mod.exposedModule,
                };
                return loadRemoteModule(options).then(
                  (m) => m[mod.exposedModuleName]
                );
              },
            } as Route;
          });
        });

        let routes: Route[] = [];
        routes = routes.concat.apply([], routesArray);
        this.router.resetConfig([...routes, ...(additionalRoutes ?? [])]);

        const segments = window.location.pathname;
        this.router.navigateByUrl(segments);
      }
    );
  }

  private async loadRemoteModuleDirect(moduleDescription: any) {
    var options: LoadRemoteModuleOptions = {
      ...(moduleDescription.remoteName
        ? { remoteName: moduleDescription.remoteName }
        : { type: "module" }),
      remoteEntry: `${moduleDescription.remoteEntry}`,
      exposedModule: moduleDescription.exposedModule,
    };
    const moduleWrapper = await loadRemoteModule(options);
    const moduleCompile =
      await this.compiler.compileModuleAndAllComponentsAsync(
        moduleWrapper[moduleDescription.exposedModuleName]
      );
    let  moduleRef = moduleCompile.ngModuleFactory.create(this.injector);
    return moduleRef;
  }
}
