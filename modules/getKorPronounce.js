const axios = require("axios");
const hardCoding = require("./hardcode");

const getKorPronounce = async (text) => {
  const enRegex = /[a-z,A-z]/g;
  const splited = text.split(" ");
  let unique = "";
  let result = "";

  for (let word of splited) {
    if (enRegex.test(word)) {
      unique = word.match(enRegex)?.toString().replaceAll(",", "");
    }
  }

  try {
    const { data } = await axios.get(
      `http://aha-dic.com/View.asp?word=${unique}`
    );
    const startIdx = data.match("한글발음").index;
    const endIdx = data.match("</title>").index;

    if (data) {
      const krWord = data.slice(startIdx, endIdx);
      const left = krWord.match(/[[]/).index + 1;
      const right = krWord.match(",").index - 1;
      const realData = krWord.slice(left, right);
      result = text.replace(unique, `(${unique.toUpperCase()})/(${realData})`);
    }
  } catch (err) {
    if (err) {
      let hardResult = hardCoding(unique);
      result = text.replace(
        unique,
        `(${unique.toUpperCase()})/(${hardResult})`
      );
    }
  }
  return result;
};

module.exports = getKorPronounce;
