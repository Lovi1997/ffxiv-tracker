// Node Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { fs } = require("file-system");
const isOnline = require("is-online");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
// Own Modules
const { FileSystem } = require("../src/backend/class/Util");
// Events
const {
  appHandler,
  initJournalSections,
  initJournalCategories,
  performSearch,
  loadQuests,
  saveQuests,
} = require(`${path.join(__dirname, "../src/backend/events/events")}`);

// Variable for MainWindow
var mainWindow;

// Create main window when ready
app.whenReady().then(function () {
  mainWindow = appHandler.createWindow(BrowserWindow, autoUpdater);
  var sPath = isDev
    ? "../extraResources/log/log.log"
    : "../../extraResources/log/log.log";
  fs.unlink(`${path.join(__dirname, sPath)}`, function () {});
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
  const sPath = isDev
    ? "../extraResources/config/config.json"
    : "../../extraResources/config/config.json";
  const config = require(sPath);
  event.returnValue = { language: config.language, IconIDs: config.IconIDs };
});

// Change Language
ipcMain.handle("changeLangu", async (event, sLangu) => {
  var oFileSystem = new FileSystem();
  const sPathRead = isDev
    ? "../extraResources/config/config.json"
    : "../../extraResources/config/config.json";
  const sPathWrite = isDev
    ? "../../../../extraResources/config/config.json"
    : "../../../../../extraResources/config/config.json";

  var config = require(sPathRead);
  config.language = sLangu.toLowerCase();

  var bResult = await oFileSystem
    .write(sPathWrite, config, false)
    .then((result) => result);

  return bResult;
});
