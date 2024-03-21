import Browser from "webextension-polyfill";
import { blockWebsite } from "./utils";

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
  clearRules();
});

Browser.runtime.onMessage.addListener(async ({ type, options }, sender) => {
  if (type == "block") {
    const {
      url,
      data: { id, alternates },
    } = options;
    await blockWebsite(url, id, alternates);
    const indexUrl = Browser.runtime.getURL("index.html");
    Browser.tabs.update(sender.tab.id, { url: indexUrl + "?url=" + url });
  }
});

Browser.webNavigation.onBeforeNavigate.addListener(
  async (details) => {
    let url = new URL(details.url);
    const rules = await Browser.declarativeNetRequest.getDynamicRules();
    const blockedHosts = rules.map((rule) => rule.condition.urlFilter);
    if (blockedHosts.includes(url.origin + "/")) {
      Browser.storage.sync.set({ visiting: url.href });
    }
  },
  { url: [{ schemes: ["http", "https"] }] }
);

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
              extensionPath: "/index.html?url=" + url,
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
  await resetRules();
});
