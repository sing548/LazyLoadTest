import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: []
})
export class P2Module {
  constructor() {
    console.log("P2 loaded");
    alert("This was executed in lazy loaded part of P2!");
  }
}