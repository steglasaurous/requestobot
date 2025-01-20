export interface WindowWithElectron extends Window {
  settings?: {
    setValue: any;
    getValue: any;
    deleteValue: any;
    openTwitchLogin: any;
    openDirectoryDialog: any;
  };
  login?: {
    openTwitchLogin: any;
    onProtocolHandle: any;
  };
  songs?: {
    processSong: any;
    onProcessSongProgress: any;
  };
}
