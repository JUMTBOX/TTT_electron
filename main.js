const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const ahaFunc = require("./modules/getKorPronounce");
const papagoFunc = require("./modules/papago");
const num2kr = require("./modules/num2kr");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
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

//////////////////////////////////////////////////////////////////
ipcMain.on("translate", async (evt, payload) => {
  const text = payload;

  const enRegex = /[a-zA-Z]/g;
  const numRegex = /[0-9]/g;
  const splited = text.split(" ").filter((el) => enRegex.test(el));

  let numResTxt = text;
  if (numRegex.test(text)) {
    const numFiltered = text.split(" ").filter((el) => numRegex.test(el));
    let numReal = [];
    for (let words of numFiltered) {
      let word = words.match(numRegex).toString().replaceAll(",", "");
      numReal.push(word);
    }

    for (let words of numReal) {
      let data = num2kr(words);
      numResTxt = numResTxt.replace(words, `(${words})/(${data})`);
    }
  }

  let enReal = [];
  for (let words of splited) {
    let word = words.match(enRegex).toString().replaceAll(",", "");
    enReal.push(word);
  }

  let result1 = numResTxt;
  let result2 = numResTxt;
  for (let words of enReal) {
    try {
      let data1 = await ahaFunc(words);
      let data2 = await papagoFunc(words);
      result1 = result1.replace(words, `(${words})/(${data1})`);
      if (data2 !== "fail") {
        result2 = result2.replace(words, `(${words})/(${data2})`);
      } else {
        result2 = "웹 크롤링 실패...다시 시도해주세요!";
      }
    } catch (err) {
      console.error(err);
    }
  }

  const res = JSON.stringify([result1, result2]);

  evt.reply("translate", res);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("aha-fetch", async (evt, word) => {
  let result = "";
  try {
    const { data } = await axios.get(
      `http://aha-dic.com/View.asp?word=${word}`
    );
    const startIdx = data.match("한글발음").index;
    const endIdx = data.match("</title>").index;

    if (data) {
      const krWord = data.slice(startIdx, endIdx);
      const left = krWord.match(/[[]/).index + 1;
      const right = krWord.match(",").index - 1;
      const realData = krWord.slice(left, right);
      result = realData;
    }
    return result;
  } catch (err) {
    console.error(err);
  }
});
