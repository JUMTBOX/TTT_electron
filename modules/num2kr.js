const units = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const value1 = ["", "십", "백", "천"];
const value2 = ["", "만", "억", "조", "경"];

function convertLt10000(number) {
  let res = "";
  for (let place = 0; place < 4; place++) {
    const digit = number % 10;
    number = Math.floor(number / 10);
    if (digit === 0) continue;
    const num = digit === 1 && place !== 0 ? "" : units[digit];
    res = num + value1[place] + res;
  }
  return res;
}

function numberToWordKo(number) {
  if (number === 0) return "영";
  const wordList = [];
  let place = 0;

  while (number > 0) {
    const digits = number % 10000;
    number = Math.floor(number / 10000);
    const word = convertLt10000(digits);

    if (word !== "") {
      if (place > 0) {
        wordList.push(word + value2[place]);
      } else {
        if (digits === 1 && place === 1) {
          wordList.push(value2[1]);
        } else {
          wordList.push(word);
        }
      }
    }
    place++;
  }

  return wordList.reverse().join("");
}

function numberToWordKo2(number) {
  if (number === 0) return "영";
  const wordList = [];
  let place = 0;

  while (number > 0) {
    const digits = number % 10000;
    number = Math.floor(number / 10000);
    const word = convertLt10000(digits);
    if (word !== "") {
      if (place > 0) {
        wordList.push(word + value2[place]);
      } else {
        wordList.push(word);
      }
    }
    place++;
  }
  return wordList.reverse().join("");
}

function convertToKorean(number) {
  const TEN_NAMES = [
    "",
    "십",
    "이십",
    "삼십",
    "사십",
    "오십",
    "육십",
    "칠십",
    "팔십",
    "구십",
  ];
  const NUMBER_NAMES = [
    "영",
    "하나",
    "둘",
    "셋",
    "넷",
    "다섯",
    "여섯",
    "일곱",
    "여덟",
    "아홉",
  ];

  if (number >= 0 && number <= 99) {
    const ten = Math.floor(number / 10);
    const one = number % 10;

    const tenName = TEN_NAMES[ten];
    const oneName = NUMBER_NAMES[one];

    if (ten === 0) {
      return oneName;
    } else if (one === 0) {
      return tenName;
    } else {
      return tenName + oneName;
    }
  } else {
    return "";
  }
}

function main(word) {
  const number = parseInt(word);

  let result;
  if (number >= 10000 && word.charAt(0) === "1") {
    result = numberToWordKo(number);
  } else if (number <= 99 && number > 0) {
    result = convertToKorean(number);
  } else {
    result = numberToWordKo2(number);
  }
  return result;
}

console.log(main(320));

module.exports = main;
