import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Browser from "webextension-polyfill";
import { createUrl, getFromStorage } from "./utils";
import {
  Card,
  CardContent,
  CssVarsProvider,
  Grid,
  IconButton,
  Typography,
} from "@mui/joy";
import { Check, DragIndicator } from "@mui/icons-material";
import Draggable from "react-draggable";
import createCache from "@emotion/cache";
import { getHostName } from "./constants";
import { CacheProvider } from "@emotion/react";

function Content() {
  const [message, setMessage] = useState("");
  const url = createUrl(getHostName(document.location.href));

  useEffect(() => {
    if (url.indexOf("chrome-extension://") == 0) {
      return;
    }

    Browser.storage.sync.get([url]).then((store) => {
      setMessage(store[url].message);
    });

    Browser.storage.sync.remove(["visiting"]);
  }, [url]);

  const handleDone = async () => {
    const data = await getFromStorage(url);
    await Browser.runtime.sendMessage({
      type: "block",
      options: {
        url,
        data,
      },
    });
  };

  return (
    <CssVarsProvider defaultMode="dark" colorSchemeSelector=":host">
      <Draggable>
        <Card
          variant="soft"
          sx={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 10000,
            width: "34vh",
            maxWidth: "400px",
            boxShadow: "black 4px 2px 20px 0px",
            backdropFilter: "blur(2px)",
            // background: "#171a1ce8",
            backgroundColor: "none",

            ":hover": { cursor: "grab" },
            ":active": { cursor: "grabbing" },
          }}
        >
          <CardContent>
            <Grid
              container
              flex={1}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Grid
                paddingRight={"10px"}
                container
                flexDirection={"column"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                flex={1}
              >
                <DragIndicator />
              </Grid>
              <Grid flexDirection={"column"} flex={8}>
                <Typography level="title-md">Remember...</Typography>
                <Typography level="title-lg">{message}</Typography>
              </Grid>
              <Grid
                container
                flexDirection={"column"}
                justifyContent={"flex-end"}
                alignItems={"center"}
              >
                <IconButton
                  onClick={handleDone}
                  variant="plain"
                  color="primary"
                >
                  <Check />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Draggable>
    </CssVarsProvider>
  );
}

const hostElement = document.createElement("div");
hostElement.className = "extension-root";
document.body.appendChild(hostElement);
const shadowRoot = hostElement.attachShadow({ mode: "open" });

const cache = createCache({
  key: "shadow-styles",
  prepend: true,
  container: shadowRoot,
});

ReactDOM.render(
  <CacheProvider value={cache}>
    <Content />
  </CacheProvider>,
  shadowRoot
);
