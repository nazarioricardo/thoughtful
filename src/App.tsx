import Chrome from "webextension-polyfill";
import { FormEvent, useEffect, useState } from "react";
import "./App.css";

const URL_OR_HOST_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const HTTPS_REGEX = /^https:\/\//i;
const HTTP_REGEX = /^http:\/\//i;
const PROTOCOL = "https://";

const smallestPositiveInteger = (ids: number[]) => {
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

function App() {
  const [error, setError] = useState<Error | undefined>();
  const [storage, setStorage] = useState<Storage | undefined>();
  const [sites, setSites] = useState<string[]>([]);

  const addUrl = async (url: string, id: number) => {
    await Chrome.storage.sync.set({
      [url]: {
        bypass: false,
        alternates: [],
        id: id,
      },
    });

    await Chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [
          {
            id: id,
            priority: 1,
            action: {
              // type: "redirect",
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: {
                extensionPath: "/page/index.html#" + url,
              },
            },
            condition: {
              urlFilter: url,
              // resourceTypes: ["main_frame"],
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
          },
        ],
      }
      // () => {
      //   setSites([...sites, url]);
      // }
    );

    setSites([...sites, url]);
  };

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      url: { value: string };
    };

    let url = target.url.value;
    const isValidInput = URL_OR_HOST_REGEX.test(url);
    if (!isValidInput) {
      setError(new Error("Please input a valid web address."));
      return;
    }
    const isMissingProtocol = !HTTPS_REGEX.test(url) && !HTTP_REGEX.test(url);
    if (isMissingProtocol) {
      url = PROTOCOL + url;
    }

    const nextId = getNextId();
    await addUrl(url, nextId);
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

  useEffect(() => {
    Chrome.storage.sync.get().then((store) => {
      setSites(Object.keys(store));
      setStorage(storage);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Thoughtful Web Filter</h1>
        <form onSubmit={onSubmitForm}>
          <label>
            Filter
            <input name="url" placeholder="Add any website" />
          </label>
          <button type="submit">Submit</button>
        </form>
        {sites.map((site) => (
          <p>{site}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
