const units = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const value1 = ["", "십", "백", "천"];
const value2 = ["", "만", "억", "조", "경"];

function convertPhone(phone) {
  const korNums = ["공", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const Regex = /[-]/g;
  let phoneSplit = phone.split("");
  let result = [];
  for (let num of phoneSplit) {
    if (!Regex.test(num)) {
      result.push(korNums[Number(num)]);
    }
  }
  result = result.toString().replaceAll(",", " ").trim();
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

function convertToKorean(number, month, age) {
  const TEN_NAMES = [
    "",
    age ? "열" : month ? "시" : "십",
    age ? "스물" : "이십",
    age ? "서른" : "삼십",
    age ? "마흔" : "사십",
    age ? "쉰" : "오십",
    age ? "예순" : "육십",
    age ? "일흔" : "칠십",
    age ? "여든" : "팔십",
    age ? "아흔" : "구십",
  ];
  const NUMBER_NAMES = [
    "영",
    age ? "한" : "일",
    age ? "두" : "이",
    age ? "세" : "삼",
    age ? "네" : "사",
    age ? "다섯" : "오",
    age ? "여섯" : month ? "유" : "육",
    age ? "일곱" : "칠",
    age ? "여덟" : "팔",
    age ? "아홉" : "구",
  ];

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
}

function oclock(num) {
  num = parseInt(num);
  const gt_ten = ["", "십", "이십"];
  const combinedWithTen = [
    "",
    "일",
    "이",
    "삼",
    "사",
    "오",
    "육",
    "칠",
    "팔",
    "구",
  ];
  const lt_ten = [
    "",
    "한",
    "두",
    "세",
    "네",
    "다섯",
    "여섯",
    "일곱",
    "여덟",
    "아홉",
    "열",
  ];

  const ten = Math.floor(num / 10);
  const one = num % 10;

  const tenName = gt_ten[ten];
  const oneName = lt_ten[one];
  const combined = gt_ten[ten] + combinedWithTen[one];

  if (ten === 0) {
    return oneName;
  } else if (one === 0) {
    if (num === 10) {
      return lt_ten[num];
    }
    return tenName;
  } else if (num > 10 && num <= 12) {
    return lt_ten[10] + oneName;
  } else {
    return combined;
  }
}

function num2kr(word, month, age) {
  const number = parseInt(word);

  let result;
  if (number >= 10000 && word.charAt(0) === "1") {
    result = numberToWordKo(number);
  } else if (number <= 99 && number > 0) {
    result = convertToKorean(number, month, age);
  } else {
    result = numberToWordKo2(number);
  }
  return result;
}

function unitsTranslate(matched) {
  const units = {
    mm: "밀리미터, 미리",
    cm: "센티미터, 센티",
    m: "미터",
    km: "킬로미터, 키로",
    in: "인치",
    mg: "밀리그램",
    g: "그램",
    kg: "킬로그램, 킬로",
    t: "톤",
    cc: "시시",
    ml: "밀리리터, 미리",
    L: "리터",
    bit: "비트",
    B: "바이트",
    KB: "킬로바이트",
    MB: "메가바이트, 메가",
    GB: "기가바이트, 기가",
    TB: "테라바이트, 테라",
  };
  const matchedNum = matched.replaceAll(/[^\d]/g, "");
  const matchedEn = matched.replaceAll(/[^a-zA-Z]/g, "");
  const numRes = num2kr(matchedNum, false, false);
  const result = numRes + " " + units[matchedEn];

  return result;
}

module.exports = {
  num2kr,
  numWithEnglish,
  convertPhone,
  oclock,
  unitsTranslate,
};
