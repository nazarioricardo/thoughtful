// // content.js adds code to a web page
// console.log("content script!");
// // const storage = await chrome.storage.sync.get();
// // console.log(storage);
// // alert("PLEASE");

// // Create the overlay element
// const overlay = document.createElement("div");
// overlay.style.position = "fixed";
// overlay.style.top = "0";
// overlay.style.left = "0";
// overlay.style.width = "100%";
// overlay.style.height = "100%";
// overlay.style.backgroundColor = "rgba(0, 0, 0, 1)";
// overlay.style.display = "flex";
// overlay.style.justifyContent = "center";
// overlay.style.alignItems = "center";
// overlay.style.zIndex = "9999";

// // Create the content element within the overlay
// const overlayContent = document.createElement("div");
// overlayContent.textContent = "HELLO WORLD";
// overlayContent.style.fontSize = "24px";
// overlayContent.style.color = "white";

// // Append the content to the overlay
// overlay.appendChild(overlayContent);

// // Add the overlay to the document body
// document.body.appendChild(overlay);

// // You can close the overlay by removing it from the document
// // For simplicity, we'll close it after 5 seconds in this example.
// setTimeout(function () {
//   document.body.removeChild(overlay);
// }, 5000);
