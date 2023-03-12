import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class StartupModule {
  constructor() {
    console.log("Loaded Startup P2");
    alert("This was executed in eager module of P2!");
  }
}