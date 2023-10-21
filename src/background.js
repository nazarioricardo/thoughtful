import Chrome from "webextension-polyfill";

const clearRules = async () => {
  /**
   * CAUTION
   * Could create errors with existing plugins
   * Should look for alternate solution to clearing
   */

  const rules = await Chrome.declarativeNetRequest.getDynamicRules();
  const ids = rules.map(({ id }) => id);
  Chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ids,
  });
};

Chrome.runtime.onInstalled.addListener(async () => {
  console.log("INSTALLED");
  clearRules();
  // chrome.action.setBadgeText({
  //   text: "Off",
  // });
});
