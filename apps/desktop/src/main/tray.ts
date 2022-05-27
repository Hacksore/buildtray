import { Tray, nativeTheme, BrowserWindow, ipcMain } from "electron";
import path from "path";

import { app } from ".";

const APP_BASE_PATH = app.isPackaged
  ? path.resolve(`${__dirname}/../renderer`)
  : path.resolve(`${__dirname}/../../resources`);

const trayIconTheme = nativeTheme.shouldUseDarkColors ? "light" : "dark";
const trayIconPath = `${APP_BASE_PATH}/image/icon-${trayIconTheme}.png`;

let trayWin: BrowserWindow | null = null;

// TODO: createTrayWindow and createTree could use a refactor to combime them to a util function
async function createTrayWindow() {
  trayWin = new BrowserWindow({
    title: "Tray",
    frame: false,
    show: false,
    width: 300,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
    },
  });

  if (app.isPackaged) {
    trayWin.loadURL("https://buildtray.com");
  } else {
    trayWin.loadURL("http://localhost:3000/tray");
  }
}

app.whenReady().then(() => {
  // create the window when app laods
  createTrayWindow();
  const tray = new Tray(trayIconPath);

  tray.setToolTip("Buildtray");
  tray.addListener("click", () => {
    // show it
    trayWin?.show();

    // move it to the menubar position
    const { x, y } = tray.getBounds();
    const bounds = trayWin?.getBounds();

    if (bounds) {
      trayWin?.setPosition(x, y - bounds.height);
    }
  });

  trayWin?.addListener("blur", () => trayWin?.hide());
  trayWin?.webContents.openDevTools();

  // hide app icon in dock for macos
  app.dock.hide();

  // listen for events to change the icon color/status
  ipcMain.on("toMain", async (_, message) => {
    const { status } = JSON.parse(message);
    // change icon color based on status payload
    const path = `${APP_BASE_PATH}/image/icon-${status}.png`;
    tray.setImage(path);
  });
});
