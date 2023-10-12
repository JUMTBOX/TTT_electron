const {
  num2kr,
  numWithEnglish,
  convertPhone,
  oclock,
  unitsTranslate,
} = require("./num2kr");

const numTranslate = (text) => {
  const enRegex = /[a-z]/gi;
  const numRegex = /\d/g;
  const notNumRegex = /\D/g;
  const dateRegex = /[년월일]/g;
  const counterRegex = /\d+(?=[살개장채칸시위명석/비트/])/g;

  const numFiltered = text.split(" ").filter((el) => el.match(numRegex));
  const dateFiltered = text.split(" ").filter((el) => el.match(dateRegex));

  /**문자열에서 조사,어미 다 떼고 순수한 숫자만 담기 위한 배열*/
  let numReal = [];

  /**조건1. 소수점 판별 case*/
  if (text.match(/\d+(\.)\d+/g)) {
    const origin = text.match(/\d+(\.)\d+/g);
    for (let digit of origin) {
      const left = digit.match(/\d+(?=\.)/)[0];
      const right = digit.match(/(?<=\.)\d+/)[0];

      let leftRes = num2kr(left);
      let rightRes = convertPhone(right);

      if (
        (digit === "2.28",
        "3.1",
        "3.8",
        "3.15",
        "4.3",
        "4.19",
        "5.18",
        "6.10",
        "6.25",
        "8.15")
      ) {
        text = text.replaceAll(
          digit,
          `(${digit})/(${leftRes}${rightRes.replaceAll(" ", "")})`
        );
      } else {
        text = text.replace(
          digit,
          `(${digit})/(${leftRes} 점 ${rightRes.replaceAll(" ", "")})`
        );
      }
    }
  }

  /**조건2.숫자 뒤에 백,천,만 등이 붙는 경우*/
  if (text.match(/\d+(?=[백천만억])/g)) {
    const filtered = text.match(/\d+[백천만](\d+)?/g);
    const backwards = text.match(/(?<=[백천만])\d+/g);
    let backNum;

    for (let digit of filtered) {
      const ing = digit
        .match(/[백천만]/g)
        .toString()
        .replaceAll(",", "");
      const data = num2kr(parseInt(digit));

      if (digit.match(/[백천만]\d+/g)) {
        backNum = num2kr(...backwards);
        text = text.replaceAll(digit, `(${digit})/(${data}${ing} ${backNum})`);
      } else {
        text = text.replaceAll(digit, `(${digit})/(${data}${ing})`);
      }
    }
  }

  /**조건3. 스코어를 이야기하는 case */
  if (text.match(/[\b대\b]/g)) {
    const matched = [...text.matchAll(/\d/g)];
    const matchedLong = text.split(" ").filter((el) => el.match(/[\b대\b\d]/g));
    const [firstIdx, lastIdx] = [
      matched[0]["index"],
      matched[matched.length - 1]["index"],
    ];
    const alternate = text.slice(firstIdx, lastIdx + 1);
    const realNum = matchedLong.filter((el) => el.match(/\d/g));
    const [leftScore, rightScore] = [num2kr(realNum[0]), num2kr(realNum[1])];

    text = text.replaceAll(
      alternate,
      `(${alternate})/(${leftScore} 대 ${rightScore})`
    );
  }

  /** 조건4. 년 월 일 포함 case */
  if (text.match(/(\d+|[백천만억조])(?=[년월일])/g)) {
    /**백,천,만 조건식에서 변환되었다면 동작*/
    if (text.match(/\)(?=[년월일])/g)) {
      console.log("excuted");
      let startIdx = [...text.matchAll(/\)(?=[년월일])/g)][0]["index"] + 1;
      let postAdd = text.slice(startIdx, startIdx + 1);
      let willReplacedList = text.match(/\((\S+)\)[년월일]/g);

      for (let willReplaced of willReplacedList) {
        let alternative = willReplaced
          .replace("년", "")
          .replaceAll(")", ` ${postAdd})`);

        text = text.replaceAll(willReplaced, alternative);
      }
    }

    for (let words of dateFiltered) {
      const ing = words.match(/[년월일]/g).toString();
      const word = words.match(numRegex).toString().replaceAll(",", "") + ing;
      const addOn = words.match(/\D+(?=[년월일])/g);

      let data = num2kr(words);

      if (ing === "년" || ing === "일") {
        addOn !== null
          ? (text = text.replace(
              words,
              `(${words})/(${data}${addOn
                .toString()
                .replaceAll(",", "")} ${ing})`
            ))
          : (text = text.replace(word, `(${word})/(${data} ${ing})`));
      } else if (ing === "월") {
        if (words === "6월" || words === "10월") {
          data = num2kr(words, true, false);
          text = text.replace(word, `(${word})/(${data}${ing})`);
        } else {
          data = num2kr(words, false, false);
          text = text.replace(word, `(${word})/(${data} ${ing})`);
        }
      }
    }
  }

  /**조건없이 그냥 numFiltered 루프를 시작하는데, 조건식을 다는 방향으로 리팩토링 해야할 듯 */
  for (let words of numFiltered) {
    /**조건5. 나이 or 수량 or 시간 */
    if (words.match(counterRegex) && !words.match(/\([가-힣]+\)/g)) {
      const ing = words
        .match(/[살개장채칸시위명석/비트/]/g)
        .toString()
        .replaceAll(",", "");
      const word = words.match(numRegex).toString().replaceAll(",", "") + ing;

      let data = num2kr(words, false, true);

      if (ing === "시") {
        data = oclock(words);
      }
      if (ing === "위" || ing === "비트") {
        data = num2kr(words, false, false);
      }
      text = text.replace(word, `(${word})/(${data} ${ing})`);
    }

    /**조건6. 숫자의 앞자리가 0이면 전화번호로 간주 */
    if (words[0] === "0") {
      const numStr = numFiltered
        .slice(numFiltered.indexOf(words))
        .toString()
        .replaceAll(",", "");
      const data = convertPhone(numStr);

      /**전화번호가 공백으로 이어져 있는 경우 */
      let condition = numFiltered.slice(numFiltered.indexOf(words));
      if (condition.length > 1) {
        let notNum = condition
          .filter((el) => el.match(notNumRegex))
          .toString()
          .replaceAll(",", "")
          .match(notNumRegex);
        let numWithEmpty = numFiltered
          .slice(numFiltered.indexOf(words))
          .toString()
          .replaceAll(",", " ");
        const tempText = text.slice(
          text.match(numWithEmpty)["index"],
          text.match(numWithEmpty)["index"] +
            (numWithEmpty.length - notNum.length)
        );
        text = text.replace(tempText, `(${tempText})/(${data})`);
      } else {
        /** 전화번호가 하이픈으로 이어져있거나 그냥 붙어서 적힌 경우*/
        let notNum = condition
          .filter((el) => el.match(notNumRegex))
          .toString()
          .replaceAll(",", "")
          .match(notNumRegex);
        words = words.slice(0, words.length - notNum.length);
        text = text.replaceAll(words, `(${words})/(${data})`);
      }
      break;
    }

    /**조건7. km,kg 등의 단위*/
    if (text.match(/\d+(?=[a-z]+)/gi)) {
      const matched = text.match(/\d+([a-z]+)/gi);
      for (let willReplaced of matched) {
        let res = unitsTranslate(willReplaced);
        text = text.replaceAll(willReplaced, `(${willReplaced})/(${res})`);
      }
    }

    /**조건8. 영어와 같이 있으면 숫자도 영문식으로 발음 */
    let word = words.match(numRegex).toString().replaceAll(",", "");

    if (words.match(enRegex) && !words.match(/\d+(?=[a-z]+)/gi)) {
      const data = numWithEnglish(word);
      text = text.replace(word, `(${word})/(${data})`);
    } else if (
      !words.match(dateRegex) /** 년월일에 걸러진 것 제외 */ &&
      !words.match(counterRegex) /** 살과 같이 나이인 것 제외 */ &&
      !words.match(/[\b대\b]/g) /** 스코어를 이야기 하는 경우 제외*/ &&
      !words.match(/\d+(\.)\d+/g) /**소수점 제외 */ &&
      !words.match(
        /\d+(?=[백천만])/g
      ) /**숫자 뒤에 백,천,만이 붙은 경우 제외*/ &&
      !words.match(/\d+(?=[a-z]+)/gi) /**km,kg 등의 단위 제외 */
    ) {
      numReal.push(word);
    }
  }

  /**조건9. 백,천,만etc가 붙어있어서 이미 변환된 결과 뒤에 수량 단위가 붙어 있는 경우 */
  if (text.match(/(\)|\)\s)(?=[살개장채칸시위명석])/g)) {
    let matched = text.match(/([가-힣]+\)|[가-힣]+\)\s)[살개장채칸시위명석]/g);
    for (let willReplaced of matched) {
      let res = willReplaced.replaceAll(/[살개장채칸시위명석\)]/g, "");
      let ing = willReplaced.replaceAll(/[^살개장채칸시위명석]/g, "");
      text = text.replaceAll(willReplaced, `${res} ${ing})`);
    }
  }

  /** 위의 조건에 다 해당 되지 않는 경우 일반적인 숫자 발음으로 치환 */
  for (let words of numReal) {
    const data = num2kr(words);
    text = text.replaceAll(words, `(${words})/(${data})`);
  }

  return text;
};

module.exports = { numTranslate };
