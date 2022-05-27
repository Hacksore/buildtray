interface Window {
  electron: {
    send: (key: string, val: unknown) => void;
    openInBrowser: (url: string) => void;
  };
}
