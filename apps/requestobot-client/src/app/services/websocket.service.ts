import { Observer, of, retry, Subject, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Inject, Injectable } from '@angular/core';
import { WEBSOCKET_URL } from '../app.config';
import { WsEvent } from '../models/ws-event';

// NOTES:
//   I wonder if this could be simplified a bit to be easier to read.  Is it useful
//   to use the WebSocketSubject or just use a plain websocket connection instead?
//   Also is it worthwhile to use ngStore directly in here vs a more generic approach?
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject$: Subject<WsEvent> = new Subject();
  public messages$ = this.messagesSubject$.pipe(
    catchError((e) => {
      throw e;
    })
  );

  public connectionStatus$: Subject<{
    isConnected: boolean;
    errorMessage?: string;
  }> = new Subject();

  /**
   * Whether the websocket is in a connected state.
   * @private
   */
  private connected = false;

  /**
   * Whether the websocket is "enabled", meaning it should be connected.
   * If true, it'll honour any retry actions needed, etc.
   *
   * @private
   */
  private active = false;

  get isActive(): boolean {
    return this.active;
  }

  /**
   * When set to false, further attempts to connect to the websocket will not be made.
   */
  public isRetryEnabled = true;

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
    @Inject(WEBSOCKET_URL) private websocketUrl = 'ws://localhost:9000'
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

  /**
   * If stopped, restart attemping connections to the websocket server.
   */
  public reconnect() {
    this.doConnect();
  }

  public sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  public close() {
    this.socket$.complete();
  }
  private doConnect() {
    this.active = true;
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

                this.connectionStatus$.next({
                  isConnected: false,
                  errorMessage: error.reason ?? 'Connection failed',
                });

                console.log(error);
                console.log('Retrying connection...');
                return timer(5000);
              }
              this.active = false;
              return throwError(() => new Error(error));
            },
          }),
          catchError((error) => of(error))
        )
        .subscribe({
          next: (data) => {
            this.messagesSubject$.next(data);
          },
          error: (err) => {
            // Dispatch an error event?
            console.log('Got an error');
            console.log(err);
            this.connected = false;
            this.connectionStatus$.next({
              isConnected: false,
              errorMessage: err ?? 'Connection failed',
            });
          },
          complete: () => {
            console.log('Connection closed for ' + this.websocketUrl);
          },
        });
    }
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
            'Close observer on websocket: COMPLETE' + this.websocketUrl
          );
        },
      },
    });
  }
}
