const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
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
////////////////////////////////////////////////////////
const papagoFunc = async (text) => {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().headless())
    .build();

  try {
    //파파고 접속하기
    await driver.get("https://papago.naver.com/");

    //언어 선택 드롭다운 버튼
    let dropBtn = await driver.findElement(By.css("#ddSourceLanguageButton"));

    await driver
      .wait(until.elementLocated(By.css("#ddSourceLanguageButton")), 3000)
      .then(dropBtn.click());

    //언어 목록 중 영어를 선택
    let enBtn = await driver.findElement(
      By.css(
        "#ddSourceLanguage > div.dropdown_menu___XsI_h.active___3VPGL > ul > li:nth-child(3)"
      )
    );
    let action = driver.actions({ async: true });
    await action.move({ origin: enBtn }).click().perform();

    //단어 입력란 찾아가서 인자로 받은 text 입력
    let textInput = await driver.findElement(By.css("#txtSource"));

    await textInput.sendKeys(text, Key.ENTER);

    //단어 입력한 후 한글 발음이 표시되는 span태그가 나타나길 기다림
    await driver.wait(
      until.elementLocated(By.css(".diction_text___1alha span")),
      10000
    );
    let resultEl = await driver.findElement(
      By.css(".diction_text___1alha span")
    );
    // 한글 발음이 표시된 span 태그가 나오면 태그안의 텍스트를 가져옴
    let result = await resultEl.getText();
    return result;
  } catch (err) {
    return "fail";
  } finally {
    setTimeout(() => {
      driver.quit();
    }, 1000);
  }
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

  let result1 = numResTxt;
  let result2 = numResTxt;
  for (let words of enReal) {
    try {
      let data1 = await ahaFunc(words);
      // let data2 = await papagoFunc(words);
      result1 = result1.replace(words, `(${words})/(${data1})`);
      // if (data2 !== "fail") {
      //   result2 = result2.replace(words, `(${words})/(${data2})`);
      // } else {
      //   result2 = "웹 크롤링 실패...다시 시도해주세요!";
      // }
    } catch (err) {
      console.error(err);
    }
  }
  const res = JSON.stringify([result1, result2]);
  return res;
});
