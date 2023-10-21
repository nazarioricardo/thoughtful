const clearRules = async () => {
  /**
   * CAUTION
   * Could create errors with existing plugins
   * Should look for alternate solution to clearing
   */

  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  const ids = rules.map(({ id }) => id);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ids,
  });
};

chrome.runtime.onInstalled.addListener(async () => {
  console.log("INSTALLED");
  clearRules();
  // chrome.action.setBadgeText({
  //   text: "Off",
  // });
});
