const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const test = async (text) => {
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
    let answer = await resultEl.getText();
    let result = `(${text.toUpperCase()})/(${answer})`;
    return result;
  } catch (err) {
    return "웹 크롤링에 실패하였습니다. 다시 시도해주세요!";
  } finally {
    setTimeout(() => {
      driver.quit();
    }, 1000);
  }
};

module.exports = test;
