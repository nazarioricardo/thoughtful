import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Browser from "webextension-polyfill";
import { getFromStorage } from "./utils";
import { Card, CssVarsProvider, Grid, IconButton, Typography } from "@mui/joy";
import { Check } from "@mui/icons-material";

function Main() {
  const [message, setMessage] = useState("");
  const url = document.location.href;

  useEffect(() => {
    if (url.indexOf("chrome-extension://") == 0) {
      return;
    }

    Browser.storage.sync.get([url]).then((store) => {
      setMessage(store[url].message);
    });
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

  if (url.indexOf("chrome-extension://") == 0) {
    return;
  }

  return (
    <CssVarsProvider defaultMode="dark">
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
          background: "#171a1ce8",
          backgroundColor: "none",
        }}
      >
        <Typography level="title-md">Remember...</Typography>
        <Grid
          container
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Grid>
            <Typography level="title-lg">{message}</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleDone} variant="plain" color="primary">
              <Check />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    </CssVarsProvider>
  );
}

const hostElement = document.createElement("div");
hostElement.className = "extension-host";
hostElement.innerHTML = "thouthful shadow";
document.body.appendChild(hostElement);

//Using Shadow Root
const host = document.querySelector(".extension-host");
const root = host.attachShadow({ mode: "open" });
const app = document.createElement("div");

app.id = "extension-root";

app.appendChild(root);
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
