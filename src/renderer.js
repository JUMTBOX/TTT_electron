const { ipcRenderer, Notification } = require("electron");

window.onload = () => {
  const input = document.querySelector("input");
  const btn = document.querySelector("button");
  const textarea = document.querySelector("textarea");

  btn.addEventListener("click", () => {
    const text = input.value;

    ipcRenderer.send("translate", text);
  });

  //엔터키 눌러도 실행
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = input.value;
      ipcRenderer.send("translate", text);
    }
  });

  ipcRenderer.on("translate", (evt, payload) => {
    const data = JSON.parse(payload);
    setTimeout(() => {
      let notice = new Notification({
        title: "Loading...",
        body: "데이터를 가져오는 중 입니다...",
      });
      new window.Notification(notice.title, notice.body);
    }, 3000);
    textarea.innerHTML = `아하사전 결과 : ${data[0]}\r파파고 결과 : ${data[1]}`;
  });
};
