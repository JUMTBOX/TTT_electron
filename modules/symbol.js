const symbolTrans = (word) => {
  const symbol = {
    plus: ["더하기", "플러스"],
    minus: ["빼기", "마이너스", "다시"],
    multi: ["곱하기", "애스태리커"],
    divide: ["나누기", "분의"],
  };

  switch (word) {
    case "+":
      return symbol["plus"].toString();
    case "-":
      return symbol["minus"].toString();
    case "*":
      return symbol["multi"].toString();
    case "/":
      return symbol["divide"].toString();
    default:
      return;
  }
};

module.exports = { symbolTrans };
