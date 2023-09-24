const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const num2kr = require("./modules/num2kr");
const hardCoding = require("./modules/hardcode");

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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//icp...
/////////////////////////////////////////////////////////
const ahaFunc = async (word) => {
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
  } catch (err) {
    if (err) {
      let hardResult = hardCoding(word);
      result = hardResult;
    }
  }
  return result;
};

ipcMain.handle("fetch", async (evt, text) => {
  const enRegex = /[a-zA-Z]/g;
  const numRegex = /[0-9]/g;
  const splited = text.split(" ").filter((el) => enRegex.test(el));

  //숫자 있으면 변환
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
  //영어 있으면 변환
  let enReal = [];
  for (let words of splited) {
    let word = words.match(enRegex).toString().replaceAll(",", "");
    enReal.push(word);
  }

  let result = numResTxt;
  for (let words of enReal) {
    try {
      let data1 = await ahaFunc(words);
      result = result.replace(words, `(${words})/(${data1})`);
    } catch (err) {
      console.error(err);
    }
  }
  const res = JSON.stringify(result);
  return res;
});
