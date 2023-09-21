const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const papagoFunc = require("../modules/papago");
const ahaFunc = require("../modules/getKorPronounce");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "./assets/회사로고1.jpeg"),
  });

  win.loadFile("./src/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("translate", async (evt, payload) => {
  const text = payload;
  const ahaResult = await ahaFunc(text);
  const papagoResult = await papagoFunc(text);
  const result = JSON.stringify([ahaResult, papagoResult]);

  evt.reply("translate", result);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
