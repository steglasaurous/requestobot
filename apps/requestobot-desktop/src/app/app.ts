import { BrowserWindow, screen, session, shell } from 'electron';
import { rendererAppName, rendererAppPort } from './constants';
import { environment } from '../environments/environment';
import { join } from 'path';
import { format } from 'url';
import * as path from 'node:path';
import { SettingsStoreService } from './services/settings-store.service';
import * as cookie from 'cookie';
import { SettingName } from '@requestobot/util-client-common';
import { getDownloaderService } from './services/downloader/get-song-downloader';
import { SongDownloader } from './services/downloader/song-downloader';
import log from 'electron-log/main';

const IPC_PROTOCOL_HANDLER = 'login.protocolHandler';
const FILTERED_URLS = [`${environment.queuebotApiBaseUrl}/*`];

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;
  static settingsStoreService: SettingsStoreService;
  static songDownloader: SongDownloader;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean =
      parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }

  private static onClose() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    App.mainWindow = null;
  }

  private static onRedirect(event: any, url: string) {
    if (url !== App.mainWindow.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private static onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.

    if (App.isDevelopmentMode()) {
      // This is a dynamic import so that the production build doesn't explode
      // (since electron-devtools-installer is a dev dependency, not included in production builds)
      import('electron-devtools-installer').then((devtoolsInstaller) => {
          devtoolsInstaller.installExtension(devtoolsInstaller.REDUX_DEVTOOLS, {
            loadExtensionOptions: { allowFileAccess: true },
          })
            .then((ext) => console.log(`Added Extension:  ${ext.name}`))
            .catch((err) => console.log('An error occurred: ', err));
      });
    }

    // This attaches the JWT cookie to the outgoing request if available,
    // so authenticated endpoints work correctly.
    session.defaultSession.webRequest.onBeforeSendHeaders(
      {
        urls: FILTERED_URLS,
      },
      (details, callback) => {
        const jwt = App.settingsStoreService.getValue(SettingName.JWT);
        if (jwt) {
          details.requestHeaders['Cookie'] = `jwt=${jwt};`;
        }
        callback({ requestHeaders: details.requestHeaders });
      }
    );

    // This captures the JWT cookie when /authCode is called in the app.
    // This allows authenticated requests to work correctly, but still
    // retain the ability for the frontend app to continue working normally
    // in a regular browser.
    // (In electron, the frontend is loaded as a file url, which doesn't allow cookies
    // to be stored - cookies only work when the app is served from an http(s) url.
    session.defaultSession.webRequest.onCompleted(
      {
        urls: FILTERED_URLS,
      },
      (details) => {
        // We only care about the auth-code endpoint, which sets the cookie.
        // Otherwise no work needs to be done.
        if (
          !details.url.includes('/auth-code') &&
          !details.url.includes('/auth/refresh')
        ) {
          return;
        }

        if (details.responseHeaders) {
          for (const key in details.responseHeaders) {
            // 'Set-Cookie' vs 'set-cookie'.  This normalizes it.
            if (key.toLowerCase() === 'set-cookie') {
              for (const value of details.responseHeaders[key]) {
                const decodedCookie = cookie.parse(value);
                if (decodedCookie['jwt']) {
                  // Store this locally.
                  App.settingsStoreService.setValue(
                    SettingName.JWT,
                    decodedCookie['jwt']
                  );
                } else if (decodedCookie['jwt_refresh']) {
                  App.settingsStoreService.setValue(
                    SettingName.JWTRefresh,
                    decodedCookie['jwt_refresh']
                  );
                }
              }
            }
          }
        }
      }
    );

    if (rendererAppName) {
      if (process.defaultApp) {
        if (process.argv.length >= 2) {
          App.application.setAsDefaultProtocolClient(
            'requestobot',
            process.execPath,
            [path.resolve(process.argv[1])]
          );
        }
      } else {
        App.application.setAsDefaultProtocolClient('requestobot');
      }
      App.initMainWindow();
      App.loadMainWindow();
    }
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'main.preload.js'),
        devTools: this.isDevelopmentMode(),
      },
      title: 'Requestobot',
    });

    App.mainWindow.setMenu(null);
    App.mainWindow.center();

    // if main window is ready to show, close the splash window and show the main window
    App.mainWindow.once('ready-to-show', () => {
      App.mainWindow.show();
      if (this.isDevelopmentMode()) {
        App.mainWindow.webContents.openDevTools();
      }
    });

    // Emitted when the window is closed.
    App.mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow.loadURL(`http://localhost:${rendererAppPort}`);
    } else {
      App.mainWindow.loadURL(
        format({
          pathname: join(
            __dirname,
            '..',
            rendererAppName,
            'browser',
            'index.html'
          ),
          protocol: 'file:',
          slashes: true,
        })
      );
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    App.BrowserWindow = browserWindow;
    App.application = app;
    log.initialize();

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated

    App.settingsStoreService = new SettingsStoreService(
      app.getPath('userData') + path.sep + 'settings.json'
    );
    // If we don't already have a setting for it, enable the auto downloader.

    if (
      App.settingsStoreService.getValue(SettingName.autoDownloadEnabled) ===
      undefined
    ) {
      App.settingsStoreService.setValue(
        SettingName.autoDownloadEnabled,
        'true'
      );
    }

    // Note this requires settingsStoreService setup for the service to be setup properly.
    App.songDownloader = getDownloaderService();

    // Windows and Linux
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (App.mainWindow) {
          if (App.mainWindow.isMinimized()) {
            App.mainWindow.restore();
          }
          App.mainWindow.focus();
          App.mainWindow.webContents.send(
            IPC_PROTOCOL_HANDLER,
            commandLine.pop()
          );
        }
      });
    }

    // MacOS
    app.on('open-url', (event, url) => {
      if (App.mainWindow) {
        App.mainWindow.focus();
        App.mainWindow.webContents.send(IPC_PROTOCOL_HANDLER, url);
      }
    });
  }
}
