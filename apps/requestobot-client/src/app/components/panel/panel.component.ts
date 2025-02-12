import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-panel',
    imports: [CommonModule],
    templateUrl: './panel.component.html',
    styleUrl: './panel.component.css'
})
export class PanelComponent {
  @Input()
  title = '';
}
