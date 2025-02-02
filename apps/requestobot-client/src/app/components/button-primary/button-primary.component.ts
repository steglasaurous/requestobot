import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-button-primary',
    imports: [],
    templateUrl: './button-primary.component.html'
})
export class ButtonPrimaryComponent {
  @Input()
  disabled: boolean = false;

  @Input()
  type: 'submit' | 'reset' | 'button' = 'button';
}
