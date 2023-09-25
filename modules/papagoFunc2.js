const puppeteer = require("puppeteer-core");

const papagoFunc = async (word) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "./chromium/chrome",
    });

    const page = await browser.newPage();

    //파파고 접속
    await page.goto("https://papago.naver.com/");
    // 언어선택 버튼 클릭
    const dropBtn = await page.waitForSelector(".btn_dropdown_arr___2xcBb");
    await dropBtn.click();
    // 영어 선택
    const EnBtn = await page.waitForSelector(
      "#ddSourceLanguage > div.dropdown_menu___XsI_h > ul > li:nth-child(3)"
    );
    await EnBtn.click();
    // 번역 내용 입력
    await page.type("#txtSource", word);
    const source = await page.waitForSelector("#txtSource");
    await source.click();
    // 번역 결과 Dom 기다린 후 텍스트 찾아와서 리턴
    const resultSelector = "#sourceEditArea > p > span";
    const resultArea = await page.waitForSelector(resultSelector);
    const result = await resultArea.evaluate((el) => el.textContent);

    //브라우저 종료
    await browser.close();

    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

async function main(text) {
  const enRegex = /[a-zA-Z]/g;
  const numRegex = /[0-9]/g;
  const splited = text.split(" ").filter((el) => enRegex.test(el));

  //숫자 있으면 변환
  let numResTxt = text;
  if (text.match(numRegex)) {
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
      let data = await papagoFunc(words);
      result = result.replace(words, `(${words})/(${data})`);
    } catch (err) {
      console.error(err);
    }
  }
  const res = JSON.stringify(result);
  return res;
}

module.exports = main;
