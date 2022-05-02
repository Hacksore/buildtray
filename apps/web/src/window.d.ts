interface Window {
  electron: {
    send: (key: string, val: any) => void;
    openInBrowser: (url: string) => void;
  };
}
