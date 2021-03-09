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
const { FileSystem } = require("./class/Util");

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

ipcMain.on("get_lang", (event) => {
  const config = require("./config/config.json");
  event.returnValue = config.language;
});

ipcMain.handle("changeLangu", async (event, sLangu) => {
  var oFileSystem = new FileSystem();

  var config = require("./config/config.json");
  config.language = sLangu.toLowerCase();

  var bResult = await oFileSystem
    .write("./config/config.json", config, false)
    .then((result) => result);

  return bResult;
});
