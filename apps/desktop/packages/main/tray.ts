import { Tray, Menu, nativeTheme } from "electron";
import pkg from "../../../../package.json";
import path from "path";

import { app } from ".";

const APP_BASE_PATH = app.isPackaged
  ? path.resolve(`${__dirname}/../renderer`)
  : path.resolve(`${__dirname}/../../public`);

const trayIconTheme = nativeTheme.shouldUseDarkColors ? "light" : "dark";
const trayIconPath = `${APP_BASE_PATH}/img/icon-${trayIconTheme}.png`;

const tray = new Tray(trayIconPath);
const contextMenu = Menu.buildFromTemplate([
  {
    label: `Buildtray ${pkg.version}`,
    enabled: false,
  },
  {
    type: "separator",
  },
]);

app.whenReady().then(() => {
  tray.setToolTip("Buildtray");
  tray.setContextMenu(contextMenu);
});
