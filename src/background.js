import Browser from "webextension-polyfill";

const clearRules = async () => {
  /**
   * CAUTION
   * Could create errors with existing plugins
   * Should look for alternate solution to clearing
   */

  const rules = await Browser.declarativeNetRequest.getDynamicRules();
  const ids = rules.map(({ id }) => id);
  Browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ids,
  });
};

Browser.runtime.onInstalled.addListener(async () => {
  console.log("INSTALLED");
  clearRules();
  // chrome.action.setBadgeText({
  //   text: "Off",
  // });
});

const resetRules = async () => {
  const store = await Browser.storage.sync.get();
  const urls = Object.keys(store);
  urls.forEach(async (url) => {
    const data = store[url];
    await Browser.storage.sync.set({
      [url]: {
        ...data,
        isBypassed: false,
      },
    });

    await Browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [data.id],
      addRules: [
        {
          id: data.id,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              extensionPath: "/index.html/?url=" + url,
            },
          },
          condition: {
            urlFilter: url,
            resourceTypes: ["main_frame"],
          },
        },
      ],
    });
  });
};

Browser.runtime.onStartup.addListener(async () => {
  console.log("STARTUP");
  await resetRules();
});
