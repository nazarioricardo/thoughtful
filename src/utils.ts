import Browser from "webextension-polyfill";

export type StorageData = {
  id: number;
  message: string;
  isBypassed: boolean;
  alternates: string[];
};

export const getFromStorage = async (url: string) => {
  const response = await Browser.storage.sync.get([url]);
  return response[url];
};

const addToStorage = async (
  url: string,
  id: number,
  alternates: string[] = []
) => {
  await Browser.storage.sync.set({
    [url]: {
      isBypassed: false,
      alternates,
      id,
    },
  });
};

const addRedirectRule = async (url: string, id: number) => {
  await Browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
    addRules: [
      {
        id: id,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            extensionPath: "/index.html/?url=" + url,
          },
        },
        condition: {
          urlFilter: url,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      },
    ],
  });
};

const addAllowRule = async (url: string, id: number) => {
  await Browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
    addRules: [
      {
        id,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.ALLOW,
        },
        condition: {
          urlFilter: url,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      },
    ],
  });
};

export const blockWebsite = async (
  url: string,
  id: number,
  alternates?: string[]
) => {
  await addRedirectRule(url, id);
  await addToStorage(url, id, alternates);
};

export const unblockWebsite = async (url: string, message: string) => {
  const response = await Browser.storage.sync.get([url]);
  const data = response[url];
  await Browser.storage.sync.set({
    [url]: {
      ...data,
      isBypassed: true,
      message,
    },
  });

  addAllowRule(url, data.id);
};

export const registerContentScript = async (url: string) => {
  try {
    await Browser.scripting.registerContentScripts([
      {
        id: url + "-script",
        js: ["static/js/content.js"],
        persistAcrossSessions: true,
        matches: [url + "/*"],
        runAt: "document_end",
        allFrames: true,
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
