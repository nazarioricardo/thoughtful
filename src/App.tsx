import Chrome from "webextension-polyfill";
import { CssVarsProvider, Sheet, Stack, Typography } from "@mui/joy";
import "./App.css";
import { useEffect, useState } from "react";
import Alternates from "./components/Alternates";

type AppProps = {
  url: string;
};

// jim carry "Do Not Go In There!"
// Jurassic Park "You didn't say the magic word!"
// Larry David "How did I end up here?"

function App({ url }: AppProps) {
  const [alternates, setAlternates] = useState<string[]>([]);
  const hostname = url.replace(/(^\w+:|^)\/\//, "");

  const onAddAlternate = async (alternate: string) => {
    const newAlternates = [...alternates, alternate];
    setAlternates(newAlternates);

    await Chrome.storage.sync.set({
      [url]: {
        alternates: newAlternates,
      },
    });
  };

  useEffect(() => {
    Chrome.storage.sync.get([url]).then((result) => {
      if (result[url]) {
        setAlternates(result[url].alternates);
      }
    });
  }, []);

  return (
    <main>
      <CssVarsProvider defaultMode="system">
        <Sheet sx={{ height: "100%" }}>
          <Stack justifyContent={"center"} alignItems={"center"}>
            <Typography level={"body-lg"}>
              You're trying to go to {hostname}.
            </Typography>
            <Alternates alternates={alternates} onAdd={onAddAlternate} />
          </Stack>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}

export default App;
