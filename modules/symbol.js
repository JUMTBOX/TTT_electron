const SymbolTrans = (text) => {
  const word = text.match(/[\+\-\*\/]/g).toString();
  const symbol = {
    plus: ["더하기", "플러스"],
    minus: ["빼기", "마이너스", "다시"],
    multi: ["곱하기", "애스태리커"],
    divide: ["나누기", "분의"],
  };

  let result;

  switch (word) {
    case "+":
      result = symbol["plus"];
      break;
    case "-":
      result = symbol["minus"];
      break;
    case "*":
      result = symbol["multi"];
      break;
    case "/":
      result = symbol["divide"];
      break;
    default:
      break;
  }

  if (text.match(/(?<=[\+\-\*\/])\d+([가-힣])/g) && word === "-") {
    result = result[2];
  } else if (text.match(/(^\d)\s?[\+\-\*\/]\s?(^\d)/g)) {
    if (word === "*") {
      result = result[1];
    } else if (word === "/") {
      result = "슬래시";
    } else {
      result = result[0] + "," + result[1];
    }
  } else {
    word === "*"
      ? (result = result[0])
      : (result = result[0] + "," + result[1]);
  }
  return result;
};

module.exports = { SymbolTrans };
