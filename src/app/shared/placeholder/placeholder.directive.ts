import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
  selector: '[appPleceholder'
})
export class placeholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}

}
