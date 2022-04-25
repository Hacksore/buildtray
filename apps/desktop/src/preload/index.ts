import { shell, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openInBrowser: (url: string) => {
    shell.openExternal(url);
  },
});