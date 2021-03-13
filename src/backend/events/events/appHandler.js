const path = require("path");

function win_all_closed(app) {
  if (process.platform !== "darwin") {
    app.quit();
  }
}
function activate(BrowserWindow, autoUpdater) {
  if (BrowserWindow.getAllWindows().length === 0) {
    return createWindow(BrowserWindow);
  }
}
function createWindow(BrowserWindow, autoUpdater) {
  const win = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadURL(`file://${path.join(__dirname, "../../../../build/index.html")}`);

  // win.once("ready-to-show", () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });

  return win;
}

module.exports = {
  win_all_closed: win_all_closed,
  activate: activate,
  createWindow: createWindow,
};
