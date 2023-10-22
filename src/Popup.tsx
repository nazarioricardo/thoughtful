import Chrome from "webextension-polyfill";
import { FormEvent, useEffect, useState } from "react";

import SiteList from "./components/SiteList";
import {
  CssVarsProvider,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Sheet,
} from "@mui/joy";
import { Add, InfoOutlined } from "@mui/icons-material";

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

function Popup() {
  const [error, setError] = useState<Error | undefined>();
  const [storage, setStorage] = useState<Storage | undefined>();
  const [sites, setSites] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const addUrl = async (url: string, id: number) => {
    await Chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: id,
          priority: 1,
          action: {
            // type: "redirect",
            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
              extensionPath: "/index.html/?url=" + url,
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
    });

    await Chrome.storage.sync.set({
      [url]: {
        bypass: false,
        alternates: [],
        id: id,
      },
    });

    const newStorage = await Chrome.storage.sync.get();
    setStorage(newStorage as Storage);
    setSites([...sites, url]);
  };

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidInput = URL_OR_HOST_REGEX.test(text);
    if (!isValidInput) {
      setError(new Error("Please input a valid web address."));
      return;
    }

    let url = text;
    const isMissingProtocol = !HTTPS_REGEX.test(url) && !HTTP_REGEX.test(url);
    if (isMissingProtocol) {
      url = PROTOCOL + url;
    }

    const nextId = getNextId();
    await addUrl(url, nextId);
    setText("");
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
    Chrome.storage.sync.get().then((newStorage) => {
      setSites(Object.keys(newStorage));
      setStorage(newStorage as Storage);
    });

    console.log(Chrome.extension.getViews());
  }, []);

  return (
    <CssVarsProvider defaultMode="system">
      <Sheet sx={{ padding: 2 }}>
        <FormControl error={Boolean(error)}>
          <FormLabel>Be Intentional</FormLabel>
          <form onSubmit={onSubmitForm}>
            <Input
              sx={{ "--Input-decoratorChildHeight": "45px" }}
              value={text}
              onChange={(event) => {
                setError(undefined);
                setText(event.target.value);
              }}
              name="url"
              placeholder="Add a website here..."
              required
              variant="soft"
              endDecorator={
                <Button
                  variant="solid"
                  color="primary"
                  type="submit"
                  startDecorator={<Add />}
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  Add
                </Button>
              }
            />
          </form>

          <FormHelperText sx={{ minHeight: 32, margin: 0 }}>
            {error && (
              <>
                <InfoOutlined />
                {error.message}
              </>
            )}
          </FormHelperText>
        </FormControl>

        {storage && <SiteList sites={sites} storage={storage} />}
        {!storage && <span>Loading...</span>}
      </Sheet>
    </CssVarsProvider>
  );
}

export default Popup;
