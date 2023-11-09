import Browser from "webextension-polyfill";
import { HTTP_REGEX, HTTPS_REGEX, PROTOCOL } from "./constants";
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

  console.log("unblockWebsite", url, data);
  await addAllowRule(url, data.id);
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

export const removeContentScripts = async (urls: string[]) => {
  Browser.scripting.unregisterContentScripts({
    ids: urls.map((url) => url + "-script"),
  });
};

export const createUrl = (text: string) => {
  let url = text;
  const isMissingProtocol = !HTTPS_REGEX.test(url) && !HTTP_REGEX.test(url);
  if (isMissingProtocol) {
    if (!url.includes("wwww.")) {
      url = "www." + url;
    }

    url = PROTOCOL + url;

    if (!url.endsWith("/")) {
      url += "/";
    }
  }

  return url;
};
