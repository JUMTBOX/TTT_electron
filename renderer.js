const { ipcRenderer } = require("electron");
const checkInternet = require("check-internet-connected");
const papagoFunc = require("./modules/papagoFunc2");

const config = {
  timeout: 5000,
  retries: 3,
  domain: "http://aha-dic.com",
};

window.onload = () => {
  checkInternet(config)
    .then(() => console.log("connection available"))
    .catch((err) => console.log("no connection", err));

  const input = document.querySelector("input");
  const btn = document.querySelector("button");
  const textarea1 = document.querySelector(".ahaResult");
  const textarea2 = document.querySelector(".papagoResult");

  btn.addEventListener("click", async () => {
    const text = input.value;
    ipcRenderer.invoke("fetch", text).then((res) => {
      const data = JSON.parse(res);
      textarea1.innerHTML = `아하사전: ${data}`;
    });
    const res = await papagoFunc(text);
    const data = JSON.parse(res);
    textarea2.innerHTML = `파파고: ${data}`;
  });

  //엔터키 눌러도 실행
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const text = input.value;

      ipcRenderer.invoke("fetch", text).then((res) => {
        const data = JSON.parse(res);
        textarea1.innerHTML = `아하사전: ${data}`;
      });

      const res = await papagoFunc(text);
      const data = JSON.parse(res);
      textarea2.innerHTML = `파파고: ${data}`;
    }
  });
};
