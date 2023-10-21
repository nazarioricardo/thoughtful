import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Popup from "./Popup";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get("url");

root.render(
  <React.StrictMode>{url ? <App url={url} /> : <Popup />}</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
