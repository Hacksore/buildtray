import { shell, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => {
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, JSON.stringify(data));
    }
  },
  openInBrowser: (url: string) => {
    shell.openExternal(url);
  },
});
