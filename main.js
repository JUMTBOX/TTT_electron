const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { ahaFunc } = require("./modules/getKorPronounce");
const { numTranslate } = require("./modules/numTranslate");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // webSecurity: false,
    },
    icon: path.join(__dirname, "./assets/회사로고1.jpg"),
  });

  win.loadFile("./index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//icp...
/////////////////////////////////////////////////////////

ipcMain.handle("fetch", async (evt, text) => {
  const enRegex = /[a-zA-Z]/g;
  const numRegex = /\d/g;

  //숫자 있으면 변환
  if (text.match(numRegex)) {
    text = await numTranslate(text);
  }
  //영어 있으면 변환
  const enFiltered = text.split(" ").filter((el) => enRegex.test(el));
  let enReal = [];
  for (let words of enFiltered) {
    let word = words.match(enRegex).toString().replaceAll(",", "");
    enReal.push(word);
  }

  for (let words of enReal) {
    try {
      let data = await ahaFunc(words);
      text = text.replace(words, `(${words})/(${data})`);
    } catch (err) {
      console.error(err);
    }
  }
  const res = JSON.stringify(text);
  return res;
});
