const { app, BrowserWindow, ipcMain } = require('electron');
const { appHandler, updateContent } = require('./events/events');
const { fs } = require('file-system');
const path = require('path');

// Create main window when ready
app.whenReady().then(function() {
  appHandler.createWindow(BrowserWindow);
  fs.unlink(`${path.join(__dirname, '../log/log.log')}`, function(){});
});

// Close everything
app.on('window-all-closed', () => {
  appHandler.win_all_closed(app);
});

//activate and create Browser window
app.on('activate', () => {
  appHandler.activate(BrowserWindow);
});

// Check for update or force update
ipcMain.on('updateContent', (bForce) => {
  updateContent();
});