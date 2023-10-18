const blockForm = document.getElementById("block-form");
let storage;

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

window.onload = async () => {
  console.log("onload");
  storage = await chrome.storage.sync.get();
};

const onBlockWebsite = async (event) => {
  event.preventDefault();
  const url = document.getElementById("url").value;
  const nextId = getNextId();

  const newStore = await chrome.storage.sync.set({
    [url]: {
      bypass: false,
      alternates: [],
      id: nextId,
    },
  });

  // const rules = await chrome.declarativeNetRequest.getDynamicRules();
  // console.log(JSON.stringify(rules));

  // [
  //   {
  //     action: {
  //       redirect: { extensionPath: "/page/index.html" },
  //       type: "redirect",
  //     },
  //     condition: { resourceTypes: ["main_frame"], urlFilter: "twitter.com" },
  //     id: 1,
  //     priority: 1,
  //   },
  // ];

  await chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: "redirect",
            // redirect: { url: "https://www.facebook.com" },
            redirect: {
              extensionPath: "/page/index.html#https://twitter.com",
            },
          },
          condition: {
            urlFilter: "twitter.com",
            // regexFilter: "^(https://twitter.com|https://github.com)",
            resourceTypes: ["main_frame"],
          },
        },
      ],
    },
    () => console.log("DECLARED")
  );
};

blockForm.addEventListener("submit", onBlockWebsite);
