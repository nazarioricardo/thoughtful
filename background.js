chrome.runtime.onInstalled.addListener(() => {
  console.log("INSTALLED");

  chrome.storage.sync.set({ alternates: ["https://nebula.tv"] });
  // chrome.action.setBadgeText({
  //   text: "Off",
  // });

  // chrome.declarativeNetRequest.updateDynamicRules(
  //   {
  //     removeRuleIds: [1],
  //     addRules: [
  //       {
  //         id: 1,
  //         priority: 1,
  //         action: {
  //           type: "redirect",
  //           // redirect: { url: "https://www.facebook.com" },
  //           redirect: { extensionPath: "/page/index.html" },
  //         },
  //         condition: {
  //           urlFilter: "twitter.com",
  //           resourceTypes: ["main_frame"],
  //         },
  //       },
  //     ],
  //   },
  //   () => console.log("DECLARED")
  // );
});

// const extensions = "https://developer.chrome.com/docs/extensions";
// const webstore = "https://developer.chrome.com/docs/webstore";

// // When the user clicks on the extension action
// chrome.action.onClicked.addListener(async (tab) => {
//   console.log("clicked");
//   if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
//     // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     // Next state will always be the opposite
//     const nextState = prevState === "ON" ? "OFF" : "ON";

//     // Set the action badge to the next state
//     await chrome.action.setBadgeText({
//       tabId: tab.id,
//       text: nextState,
//     });

//     if (nextState === "ON") {
//       // Insert the CSS file when the user turns the extension on
//       await chrome.scripting.insertCSS({
//         files: ["focus-mode.css"],
//         target: { tabId: tab.id },
//       });
//     } else if (nextState === "OFF") {
//       // Remove the CSS file when the user turns the extension off
//       await chrome.scripting.removeCSS({
//         files: ["focus-mode.css"],
//         target: { tabId: tab.id },
//       });
//     }
//   }
// });

// chrome.declarativeNetRequest.updateDynamicRules(
//   {
//     addRules: [
//       {
//         id: 1,
//         priority: 1,
//         action: {
//           type: "redirect",
//           redirect: { url: "https://www.facebook.com" },
//         },
//         condition: { urlFilter: "twitter.com", resourceTypes: ["main_frame"] },
//       },
//       // {
//       //   id: 1001,
//       //   priority: 1,
//       //   action: {
//       //     type: "redirect",
//       //     redirect: {
//       //       url: "https://www.facebook.com",
//       //     },
//       //   },
//       //   condition: {
//       //     urlFilter: "https://www.twitter.com",
//       //     resourceTypes: ["main_frame"],
//       //   },
//       // },
//     ],
//     removeRuleIds: [1, 2, 1001],
//   },
//   () => {
//     console.log("UPDATE");
//   }
// );

// chrome.webRequest.onBeforeRequest.addListener(
//   (event) => {
//     console.log("Before", event);
//   },
//   {
//     urls: ["<all_urls>"],
//   },
//   ["blocking"]
// );

// Get arrays containing new and old rules
// const newRules = await getNewRules();
// const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
// const oldRuleIds = oldRules.map(rule => rule.id);

// // Use the arrays to update the dynamic rules
// await chrome.declarativeNetRequest.updateDynamicRules({
//   removeRuleIds: oldRuleIds,
//   addRules: newRules
// });
