import Browser from "webextension-polyfill";
import { blockWebsite, getFromStorage } from "./utils";

if (typeof init === "undefined") {
  const init = async () => {
    const url = document.location.href;
    if (url.indexOf("chrome-extension://") == 0) {
      return;
    }

    console.log("GETTING", url);
    const store = await Browser.storage.sync.get([url]);
    console.log("GOT", JSON.stringify(store));

    const hostEle = document.createElement("div");
    hostEle.className = "thoughtful-element-host";
    hostEle.innerHTML = "The thouthful shadow";
    document.body.appendChild(hostEle);

    //Using Shadow Root
    const host = document.querySelector(".thoughtful-element-host");
    const root = host.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.className = "thoughtful root-class";
    div.innerHTML = `
      <style> 
      .thoughtful { 
        padding: 24px;
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 9999999999999999999999;
        background-color: black;
        border-radius: 16px;
        box-shadow: black 4px 2px 20px 0px;
        color: white;
      }
      </style>
      ${store[url].message}`;

    const button = document.createElement("button");
    button.className = "thoughtful-button";
    button.innerHTML = `
      <style>
        .thoughtful-button {
          background-color: white;
          color: black;
          border-radius: 8px;
          padding: 8px;
          margin-top: 8px;
          border: none;
          font-size: 16px;
          font-weight: bold;
          width: 76px;
          height: 32px;
        }
      </style>
      Done
    `;

    button.onclick = async () => {
      const data = await getFromStorage(url);
      await Browser.runtime.sendMessage({
        type: "block",
        options: {
          url,
          data,
        },
      });
    };

    div.appendChild(button);
    root.appendChild(div);
  };

  init();
}
