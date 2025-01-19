import { Component } from '@angular/core';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { GameDto } from '@requestobot/util-dto';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { ButtonPrimaryComponent } from '../button-primary/button-primary.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-change-game',
  standalone: true,
  imports: [
    NgFor,
    ButtonPrimaryComponent,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './change-game.component.html',
})
export class ChangeGameComponent {
  games: GameDto[] = [];
  constructor(
    private queuebotApiService: QueuebotApiService,
    public dialogRef: MatDialogRef<ChangeGameComponent>
  ) {
    this.queuebotApiService.getGames().subscribe((gameDtos) => {
      this.games = gameDtos;
    });
  }

  selectGame(id: number) {
    // Return this back to the caller if we can, it has awareness of what channel to update.
    this.dialogRef.close(id);
  }
}
