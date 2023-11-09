import React from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer } from "react-frame-component";
import App from "./App";
import Browser from "webextension-polyfill";
import { blockWebsite, getFromStorage } from "./utils";

// if (typeof init === "undefined") {
//   const init = async () => {
//     const url = document.location.href;
//     if (url.indexOf("chrome-extension://") == 0) {
//       return;
//     }

//     const store = await Browser.storage.sync.get([url]);

//     const hostElement = document.createElement("div");
//     hostElement.className = "thoughtful-element-host";
//     hostElement.innerHTML = "The thouthful shadow";
//     document.body.appendChild(hostElement);

//     //Using Shadow Root
//     const host = document.querySelector(".thoughtful-element-host");
//     const root = host.attachShadow({ mode: "open" });
//     const div = document.createElement("div");
//     div.className = "thoughtful root-class";
//     div.innerHTML = `
//       <style>
//       .thoughtful {
//         padding: 24px;
//         position: fixed;
//         top: 24px;
//         right: 24px;
//         z-index: 9999999999999999999999;
//         background-color: black;
//         border-radius: 16px;
//         box-shadow: black 4px 2px 20px 0px;
//         color: white;
//       }
//       </style>
//       ${store[url].message}`;

//     const button = document.createElement("button");
//     button.className = "thoughtful-button";
//     button.innerHTML = `
//       <style>
//         .thoughtful-button {
//           background-color: white;
//           color: black;
//           border-radius: 8px;
//           padding: 8px;
//           margin-top: 8px;
//           border: none;
//           font-size: 16px;
//           font-weight: bold;
//           width: 76px;
//           height: 32px;
//         }
//       </style>
//       Done
//     `;

//     button.onclick = async () => {
//       const data = await getFromStorage(url);
//       await Browser.runtime.sendMessage({
//         type: "block",
//         options: {
//           url,
//           data,
//         },
//       });
//     };

//     div.appendChild(button);
//     root.appendChild(div);
//   };

//   init();
// }

/*global chrome*/
/* src/content.js */

class Main extends React.Component {
  render() {
    return (
      <Frame
        head={[
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/content.css")}
          ></link>,
        ]}
      >
        <FrameContextConsumer>
          {({ document, window }) => {
            return <App document={document} window={window} isExt={true} />;
          }}
        </FrameContextConsumer>
      </Frame>
    );
  }
}

const hostElement = document.createElement("div");
hostElement.className = "thoughtful-element-host";
hostElement.innerHTML = "The thouthful shadow";
document.body.appendChild(hostElement);

//Using Shadow Root
const host = document.querySelector(".thoughtful-element-host");
const root = host.attachShadow({ mode: "open" });
const app = document.createElement("div");

app.id = "my-extension-root";

app.appendChild(root);
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    toggle();
  }
});

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}
