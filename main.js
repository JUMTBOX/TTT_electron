const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { ahaFunc } = require("./modules/getKorPronounce");
const { numTranslate } = require("./modules/numTranslate");
const { SymbolTrans } = require("./modules/symbol");
const {
  num2kr,
  numWithEnglish,
  convertPhone,
  oclock,
  unitsTranslate,
} = require("./modules/num2kr");

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
  const enFiltered = text
    .split(" ")
    .filter((el) => enRegex.test(el) && !/\(\d+[a-zA-Z]+\)/g.test(el));

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
  /**조건9. 영어와 같이 있으면 숫자도 영문식으로 발음 */
  if (
    text.match(/(\([a-z]+\)\/\([가-힣]+\))[\-\s]?(\(\d+\)\/\([가-힣]+\))/gi)
  ) {
    const numWithEn = text.match(
      /(\([a-z]+\)\/\([가-힣]+\))[\-\s]?(\(\d+\)\/\([가-힣]+\))/gi
    );
    for (let item of numWithEn) {
      let enAndNum = item
        .match(/[\w\-]+/g)
        .toString()
        .replaceAll(",", "");

      let kor = item
        .match(/[가-힣]+/g)
        .toString()
        .replaceAll(",", " ");

      const word = enAndNum.replaceAll(/[^0-9]/g, "");
      const data1 = numWithEnglish(word);
      const data2 = convertPhone(word);
      text = text.replace(item, `(${enAndNum})/(${kor},${data1},${data2})`);
    }
  }

  /** 영어 전사 합치는 로직*/
  if (
    text.match(/(\(\w+\)\/\(\S+\)\s\(\w+\)\/\(\S+\))(\s\(\w+\)\/\(\S+\))*/gi)
  ) {
    const findStickedTranslated = text.match(
      /(\(\w+\)\/\(\S+\)\s\(\w+\)\/\(\S+\))(\s\(\w+\)\/\(\S+\))*/gi
    );
    for (let item of findStickedTranslated) {
      let alterEn = item
        .match(/\w+(?=\)\/)/g)
        ?.toString()
        .replaceAll(",", " ");

      let alterKr = item
        .match(/(?<=\/\()[^\)]+/g)
        ?.toString()
        .replaceAll(",", " ");

      text = text.replaceAll(item, `(${alterEn})/(${alterKr})`);
    }
  }

  const res = JSON.stringify(text);
  return res;
});
