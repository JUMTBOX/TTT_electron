const { ipcRenderer } = require("electron");
const checkInternet = require("check-internet-connected");

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
  const textarea = document.querySelector("textarea");

  btn.addEventListener("click", () => {
    const text = input.value;
    ipcRenderer.invoke("fetch", text).then((res) => {
      const data = JSON.parse(res);
      console.log(data);
      textarea.innerHTML = `아하사전 : ${data[0]}\r파파고  : ${data[1]}`;
    });
  });

  //엔터키 눌러도 실행
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = input.value;

      ipcRenderer.invoke("fetch", text).then((res) => {
        const data = JSON.parse(res);
        console.log(data);
        textarea.innerHTML = `아하사전 : ${data[0]}`;
        // \r파파고  : ${data[1]}
      });
    }
  });
};
