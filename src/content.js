console.log("this is content js");
if (typeof init === "undefined") {
  const init = function () {
    if (document.location.href.indexOf("chrome-extension://") == 0) {
      return;
    }

    const hostEle = document.createElement("div");
    hostEle.className = "rustyZone-element-host";
    hostEle.innerHTML = "Hello From the Rusty Zone Element";
    document.body.appendChild(hostEle);

    //Using Shadow Root
    var host = document.querySelector(".rustyZone-element-host");
    var root = host.attachShadow({ mode: "open" }); // Create a Shadow Root
    var div = document.createElement("div");
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
      Hello From the Rusty Zone Shadow Root Element`;
    root.appendChild(div);
  };

  init();
}
