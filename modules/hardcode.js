const hardCoding = (unique) => {
  let enRegex = /[a-z,A-Z]/g;
  let matched = unique.match(enRegex);
  let result = "";

  let enObj = {
    65: "에이",
    66: "비",
    67: "씨",
    68: "디",
    69: "이",
    70: "에프",
    71: "지",
    72: "에이치",
    73: "아이",
    74: "제이",
    75: "케이",
    76: "엘",
    77: "엠",
    78: "엔",
    79: "오",
    80: "피",
    81: "큐",
    82: "알",
    83: "에스",
    84: "티",
    85: "유",
    86: "브이",
    87: "더블유",
    88: "엑스",
    89: "와이",
    90: "제트",
  };

  if (matched !== null) {
    for (let spell of matched) {
      let digit = spell.toUpperCase().charCodeAt(0);
      result += enObj[`${digit}`];
    }
  }
  return result;
};

module.exports = hardCoding;
