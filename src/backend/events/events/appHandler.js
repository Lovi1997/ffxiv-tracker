const path = require("path");

function win_all_closed(app) {
    if (process.platform !== 'darwin') {
        app.quit()
    }
};
function activate(BrowserWindow) {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(BrowserWindow);
    }
};
function createWindow(BrowserWindow) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadURL(`file://${path.join(__dirname, "../../../../build/index.html")}`);
};

module.exports = {
    win_all_closed: win_all_closed,
    activate: activate,
    createWindow: createWindow
};