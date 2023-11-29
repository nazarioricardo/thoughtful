import Browser from "webextension-polyfill";
import { FormEvent, useEffect, useState } from "react";
import { URL_OR_HOST_REGEX } from "./constants";
import SiteList from "./components/SiteList";
import {
  CssVarsProvider,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { Add, InfoOutlined } from "@mui/icons-material";
import {
  blockWebsite,
  createUrl,
  registerContentScript,
  removeContentScripts,
} from "./utils";

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
  const [validationError, setValidationError] = useState<Error | undefined>();
  const [storageError, setStorageError] = useState<Error | undefined>();
  const [storage, setStorage] = useState<Storage | undefined>();
  const [sites, setSites] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const addUrl = async (url: string, id: number) => {
    console.log("addUrl");
    try {
      registerContentScript(url);
    } catch (error) {
      console.error(error);
      throw error;
    }

    await blockWebsite(url, id);
    const newStorage = await Browser.storage.sync.get();
    setStorage(newStorage as Storage);
    setSites([...sites, url]);
  };

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidInput = URL_OR_HOST_REGEX.test(text);
    if (!isValidInput) {
      setValidationError(new Error("Please input a valid web address."));
      return;
    }

    console.log("valid");
    const url = createUrl(text);
    const nextId = getNextId();

    try {
      await addUrl(url, nextId);
      setText("");
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error);
      } else {
        console.error(error);
        setValidationError(new Error("Unknown Error"));
        // chrome.declarativeNetRequest.RuleActionType is undefined
      }
    }
  };

  const getNextId = () => {
    console.log("getNextId");
    if (!storage) {
      return 1;
    }

    const ids = Object.keys(storage).map((key) => {
      return storage[key].id;
    });

    return smallestPositiveInteger(ids);
  };

  const onDelete = async (sites: string[]) => {
    if (!storage) {
      return;
    }

    const sitesInStorage = await Browser.storage.sync.get(sites);
    const ids = Object.keys(sitesInStorage).map((s) => storage[s].id);
    await Browser.storage.sync.remove(sites);
    await Browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ids,
    });
    await removeContentScripts(sites);

    const newStorage = await Browser.storage.sync.get();
    setStorage(newStorage as Storage);
    setSites(Object.keys(newStorage));
  };

  useEffect(() => {
    Browser.storage.sync
      .get()
      .then((newStorage) => {
        setSites(Object.keys(newStorage));
        setStorage(newStorage as Storage);
      })
      .catch((error) => {
        setStorageError(error);
      });
  }, []);

  return (
    <CssVarsProvider defaultMode="dark">
      <Sheet sx={{ padding: 2 }}>
        <FormControl error={Boolean(validationError)}>
          <FormLabel>Be Intentional</FormLabel>
          <form onSubmit={onSubmitForm}>
            <Input
              sx={{ "--Input-decoratorChildHeight": "45px" }}
              value={text}
              onChange={(event) => {
                setValidationError(undefined);
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
            {validationError && (
              <>
                <InfoOutlined />
                {validationError.message}
              </>
            )}
          </FormHelperText>
        </FormControl>

        {storage && (
          <SiteList sites={sites} storage={storage} onDelete={onDelete} />
        )}
        {!storage && !storageError && <Typography>Loading...</Typography>}
        {!storage && storageError && (
          <Typography color="warning">Error: {storageError.message}</Typography>
        )}
      </Sheet>
    </CssVarsProvider>
  );
}

export default Popup;
