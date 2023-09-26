const units = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const value1 = ["", "십", "백", "천"];
const value2 = ["", "만", "억", "조", "경"];

function convertPhone(phone) {
  const korNums = ["공", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const Regex = /[-]/g;
  let result = [];
  let phoneSplit = phone.split("");

  for (let num of phoneSplit) {
    if (!Regex.test(num)) {
      result.push(korNums[Number(num)]);
    }
  }
  result = result.toString().replaceAll(",", " ");
  return result;
}

function numWithEnglish(word) {
  const numWithEn = {
    1: "원",
    2: "투",
    3: "쓰리",
    4: "포",
    5: "파이브",
    6: "식스",
    7: "세븐",
    8: "에잇",
    9: "나인",
    10: "텐",
    11: "일레븐",
    12: "투웰브",
    13: "써틴",
    14: "포틴",
    15: "피프틴",
    16: "식스틴",
    17: "세븐틴",
    18: "에이틴",
    19: "나인틴",
    20: "투웬티",
    30: "써티",
    40: "포티",
    50: "피프티",
    60: "식스티",
    70: "세븐티",
    80: "에이티",
    90: "나인티",
  };
  word = Number(word);
  if (word > 20 && word < 30) {
    return numWithEn[20] + numWithEn[word - 20];
  } else if (word > 30 && word < 40) {
    return numWithEn[30] + numWithEn[word - 30];
  } else if (word > 40 && word < 50) {
    return numWithEn[40] + numWithEn[word - 40];
  } else if (word > 50 && word < 60) {
    return numWithEn[50] + numWithEn[word - 50];
  } else if (word > 60 && word < 70) {
    return numWithEn[60] + numWithEn[word - 60];
  } else if (word > 70 && word < 80) {
    return numWithEn[70] + numWithEn[word - 70];
  } else if (word > 80 && word < 90) {
    return numWithEn[80] + numWithEn[word - 80];
  } else if (word > 90 && word < 100) {
    return numWithEn[90] + numWithEn[word - 90];
  }
  return numWithEn[word];
}

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

function num2kr(word) {
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

module.exports = { num2kr, numWithEnglish, convertPhone };
