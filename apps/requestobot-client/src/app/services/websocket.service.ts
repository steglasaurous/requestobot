import { Observer, of, retry, Subject, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Inject, Injectable } from '@angular/core';
import { WEBSOCKET_URL } from '../app.config';
import { WsEvent } from '../models/ws-event';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject$: Subject<WsEvent> = new Subject();
  public messages$ = this.messagesSubject$.pipe(
    catchError((e) => {
      throw e;
    }),
  );

  private connected: boolean = false;

  /**
   * When set to false, further attempts to connect to the websocket will not be made.
   */
  public isRetryEnabled: boolean = true;

  private openObserver: Observer<any> = {
    next: () => {},
    error: (err) => {},
    complete: () => {},
  };
  private closeFunction: Function = () => {};

  get isConnected(): boolean {
    return this.connected;
  }

  constructor(
    @Inject(WEBSOCKET_URL) private websocketUrl = 'ws://localhost:9000',
  ) {}

  public connect(openObserver?: Observer<any>, onClose?: Function): void {
    // Save open and close for reconnects later.
    if (openObserver) {
      this.openObserver = openObserver;
    }
    if (onClose) {
      this.closeFunction = onClose;
    }

    this.doConnect();
  }

  private doConnect() {
    if (this.socket$ && !this.socket$.closed) {
      // Force the socket to close
      this.socket$.unsubscribe();
    }

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(this.openObserver);

      this.socket$
        .pipe(
          retry({
            delay: (error) => {
              if (this.isRetryEnabled) {
                this.connected = false;
                console.log(error);
                console.log('Retrying connection...');
                return timer(5000);
              }
              return throwError(() => new Error(error));
            },
          }),
          catchError((error) => of(error)),
        )
        .subscribe({
          next: (data) => {
            this.messagesSubject$.next(data);
          },
          error: (err) => {
            console.log('Got an error');
            console.log(err);
            this.connected = false;
          },
          complete: () => {
            console.log('Connection closed for ' + this.websocketUrl);
          },
        });
    }
  }

  /**
   * If stopped, restart attemping connections to the websocket server.
   */
  public reconnect() {
    this.doConnect();
  }

  private getNewWebSocket(openObserver?: Observer<any>): WebSocketSubject<any> {
    return new WebSocketSubject<any>({
      url: this.websocketUrl,
      openObserver: openObserver,
      closeObserver: {
        next: () => {
          this.connected = false;
          this.closeFunction();
        },
        error: (err) => {
          console.log('Close observer on websocket: ERROR' + this.websocketUrl);
        },
        complete: () => {
          console.log(
            'Close observer on websocket: COMPLETE' + this.websocketUrl,
          );
        },
      },
    });
  }

  public sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  public close() {
    this.socket$.complete();
  }
}
