import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import log from 'electron-log/renderer';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Requestobot';

  constructor() {
    log.debug('Starting client');
  }
}
