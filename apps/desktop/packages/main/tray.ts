import { Tray, Menu, nativeTheme, BrowserWindow } from "electron";
import pkg from "../../../../package.json";
import path from "path";

import { app } from ".";

const APP_BASE_PATH = app.isPackaged
  ? path.resolve(`${__dirname}/../renderer`)
  : path.resolve(`${__dirname}/../../packages/renderer/public`);

const trayIconTheme = nativeTheme.shouldUseDarkColors ? "light" : "dark";
const trayIconPath = `${APP_BASE_PATH}/image/icon-${trayIconTheme}.png`;

let trayWin: BrowserWindow | null = null;

const contextMenu = Menu.buildFromTemplate([
  {
    label: `Buildtray ${pkg.version}`,
    enabled: false,
  },
  {
    type: "separator",
  },
  {
    label: `This is in progress...`,
    enabled: false,
  },
]);

// TODO: createTrayWindow and createTree could use a refactor to combime them to a util function
async function createTrayWindow() {
  trayWin = new BrowserWindow({
    title: "Main window",
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
  // tray.setContextMenu(contextMenu);

  tray.addListener("click", () => {

    // show it
    trayWin?.show();

    // focus it
    trayWin?.focus();

    // move it to the menubar position
    const { x, y } = tray.getBounds();
    // const { width, height } = trayWin?.getBounds();
    trayWin?.setPosition(x - 300/2, 20);
    
  });
});
