const { app, BrowserWindow, ipcMain } = require("electron");
const {
  appHandler,
  initJournalSections,
  initJournalCategories,
  performSearch,
  loadQuests,
  saveQuests,
} = require("./events/events");
const { fs } = require("file-system");
const path = require("path");
const isOnline = require("is-online");
const { autoUpdater } = require("electron-updater");
const { FileSystem } = require("./class/Util");

// Variable for MainWindow
var mainWindow;

// Create main window when ready
app.whenReady().then(function () {
  mainWindow = appHandler.createWindow(BrowserWindow, autoUpdater);
  fs.unlink(`${path.join(__dirname, "../log/log.log")}`, function () {});
});

// Close everything
app.on("window-all-closed", () => {
  appHandler.win_all_closed(app);
});

//activate and create Browser window
app.on("activate", () => {
  mainWindow = appHandler.activate(BrowserWindow, autoUpdater);
});

// Get Version
ipcMain.on("app_version", (event) => {
  event.returnValue = app.getVersion();
});

// Send Notification -> Update Available
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});

// Send Notification -> Update Downloaded
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

// Install Update
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

// Initialze Journal Sections
ipcMain.handle("init-JournalSections", async () => {
  let oResult = await initJournalSections();
  return oResult;
});

// Initialze Journal Sections
ipcMain.handle("init-JournalCategories", async (event, iJournalSection) => {
  let aResult = await initJournalCategories(iJournalSection);
  return aResult;
});

// Initialze Journal Sections
ipcMain.handle("loadQuests", async (event, iJournalCategory) => {
  let aResult = await loadQuests(iJournalCategory);
  return aResult;
});

// save Quests
ipcMain.handle("saveQuests", async (event, aQuests) => {
  let bResult = await saveQuests(aQuests);
  return bResult;
});

// Check online Status
ipcMain.handle("is-online", async () => {
  let bResult = await isOnline().then((online) => {
    return online;
  });
  return bResult;
});

// Do Search
ipcMain.handle("search", async (event, sSearchString) => {
  let aResult = await performSearch(sSearchString);
  return aResult;
});

// Read Config
ipcMain.on("get_config", (event) => {
  const config = require("./config/config.json");
  event.returnValue = { language: config.language, IconIDs: config.IconIDs };
});

// Change Language
ipcMain.handle("changeLangu", async (event, sLangu) => {
  var oFileSystem = new FileSystem();

  var config = require("./config/config.json");
  config.language = sLangu.toLowerCase();

  var bResult = await oFileSystem
    .write("../../config/config.json", config, false)
    .then((result) => result);

  return bResult;
});
