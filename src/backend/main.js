const { app, BrowserWindow, ipcMain } = require("electron");
const {
  appHandler,
  initJournalSections,
  initJournalCategories,
  performSearch,
} = require("./events/events");
const { fs } = require("file-system");
const path = require("path");
const isOnline = require("is-online");

// Create main window when ready
app.whenReady().then(function () {
  appHandler.createWindow(BrowserWindow);
  fs.unlink(`${path.join(__dirname, "../log/log.log")}`, function () {});
});

// Close everything
app.on("window-all-closed", () => {
  appHandler.win_all_closed(app);
});

//activate and create Browser window
app.on("activate", () => {
  appHandler.activate(BrowserWindow);
});

// Initialze Journal Sections
ipcMain.handle("init-JournalSections", async () => {
  const result = await initJournalSections();
  return result;
});

// Initialze Journal Sections
ipcMain.handle("init-JournalCategories", async () => {
  console.log("INIT");
  return [1];
});

// Initialze Journal Sections
ipcMain.handle("search", async (event, sSearchString) => {
  aResult = await performSearch(sSearchString);
  return aResult;
});

// Check online Status
ipcMain.handle("is-online", async () => {
  const result = await isOnline().then((online) => {
    return online;
  });
  return result;
});
