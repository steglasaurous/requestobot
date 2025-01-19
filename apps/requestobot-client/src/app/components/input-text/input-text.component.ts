import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [FormsModule],
  providers: [
    // Not sure what exactly this does - would like to understand this better
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements ControlValueAccessor {
  value: string = '';
  disabled: boolean = false;
  change: any = (value: any) => {};
  touched: any = () => {};

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // When the control's value should be changed, this is executed
  writeValue(obj: any): void {
    this.value = obj;
  }
}
