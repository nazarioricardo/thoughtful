const URL_OR_HOST_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const HTTPS_REGEX = /^https:\/\//i;
const HTTP_REGEX = /^http:\/\//i;
const PROTOCOL = "https://";

const blockForm = document.getElementById("block-form");
const blockInput = document.getElementById("block-url-input");
const errorDiv = document.getElementById("error-message");
const filterList = document.getElementById("filter-list");

let storage;
let error;

const smallestPositiveInteger = (ids) => {
  const pos = ids.filter((num) => num >= 1).sort((a, b) => a - b);
  let x = 1;

  for (let i = 0; i < pos.length; i++) {
    if (x < pos[i]) {
      return x;
    }
    x = pos[i] + 1;
  }
  return x;
};

const getNextId = () => {
  if (!storage) {
    return 1;
  }

  const ids = Object.keys(storage).map((key) => {
    return storage[key].id;
  });

  return smallestPositiveInteger(ids);
};

const renderUrlListItem = (url, id) => {
  filterList.innerHTML =
    filterList.innerHTML + `<li id="${"item" + id}">${url}</li>`;
};

const addUrl = async (url, id) => {
  await chrome.storage.sync.set({
    [url]: {
      bypass: false,
      alternates: [],
      id: id,
    },
  });

  await chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [
        {
          id: id,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              extensionPath: "/page/index.html#" + url,
            },
          },
          condition: {
            urlFilter: url,
            resourceTypes: ["main_frame"],
          },
        },
      ],
    },
    () => {
      renderUrlListItem(url, id);
    }
  );
};

const removeUrlListItem = (url, id) => {
  const listItem = document.getElementById("item" + id);
  listItem.remove();
};

const removeUrl = async (url) => {
  const urlData = await chrome.storage.sync.get(url);

  if (!urlData) {
    throw Error("Could not find URL in storage");
  }

  await chrome.storage.sync.remove(url);
  await await chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [urlData.id],
    },
    () => {
      removeUrlListItem(url, urlData.id);
    }
  );
};

const onBlockWebsite = async (event) => {
  event.preventDefault();
  let url = blockInput.value;
  const isValidInput = URL_OR_HOST_REGEX.test(url);

  if (!isValidInput) {
    error = new Error("Please input a valid web address.");
    errorDiv.innerHTML = "<p>" + error.message + "</p>";
    console.log("error");
    return;
  }

  const requiresProtocol = !HTTPS_REGEX.test(url) && !HTTP_REGEX.test(url);
  if (requiresProtocol) {
    url = PROTOCOL + url;
  }

  const nextId = getNextId();
  await addUrl(url, nextId);
  blockInput.value = "";
};

const onInputWebsite = () => {
  error = undefined;
  errorDiv.innerHTML = "";
};

window.onload = async () => {
  storage = await chrome.storage.sync.get();
  console.log("onload", storage);

  Object.keys(storage).forEach((key) => {
    renderUrlListItem(key);
  });
};

blockForm.addEventListener("submit", onBlockWebsite);
blockInput.addEventListener("input", onInputWebsite);
