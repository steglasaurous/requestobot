import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  providers: [SettingsService, QueuebotApiService, WebsocketService],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'queuebot-client';

  constructor() {}

  ngOnInit() {
    // This triggers dark mode for tailwind, using CSS classes that have the dark: prefix.
    // FIXME: Implement a switch "somewhere" for this.
    // window.document.documentElement.classList.add('dark');
  }
}
