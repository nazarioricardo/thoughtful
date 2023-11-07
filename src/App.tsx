import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import {
  Box,
  Button,
  CssVarsProvider,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Alternates from "./components/Alternates";
import { getHostName } from "./constants";
import Override from "./components/Override";
type AppProps = {
  url: string;
};

// jim carry "Do Not Go In There!"
// Jurassic Park "You didn't say the magic word!"
// Larry David "How did I end up here?"

function App({ url }: AppProps) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [alternates, setAlternates] = useState<string[]>([]);
  const hostname = getHostName(url);

  const onAddAlternate = async (alternate: string) => {
    const oldAlternates = alternates.filter((alt) => alt !== alternate);
    const newAlternates = [...oldAlternates, alternate];

    setAlternates(newAlternates);
    await Browser.storage.sync.set({
      [url]: {
        alternates: newAlternates,
      },
    });
  };

  const onDeleteAlternates = async (forDeletion: string[]) => {
    const undeletedAlternates = alternates.filter(
      (alt) => !forDeletion.includes(alt)
    );

    setAlternates(undeletedAlternates);
    await Browser.storage.sync.set({
      [url]: {
        alternates: undeletedAlternates,
      },
    });
  };

  const onOverride = () => {
    setIsOverriding(true);
  };

  useEffect(() => {
    Browser.storage.sync.get([url]).then((result) => {
      if (result[url]) {
        setAlternates(result[url].alternates);
      }
    });
  }, []);

  return (
    <main>
      <CssVarsProvider defaultMode="system">
        <Sheet sx={{ height: "100vh", width: "100vw" }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ height: "100vh", justifyContent: "space-evenly" }}
          >
            <Box>
              {isOverriding ? (
                <>
                  <Typography level={"body-lg"} fontWeight={"bold"}>
                    Why?
                  </Typography>
                </>
              ) : (
                <>
                  <Typography level={"body-lg"} fontWeight="bold">
                    You're trying to go to {hostname}.
                  </Typography>
                  <Typography level={"body-lg"} fontWeight={"bold"}>
                    Try going somewhere else...
                  </Typography>
                </>
              )}
            </Box>
            {isOverriding ? (
              <Override url={url} hostname={hostname} />
            ) : (
              <Alternates
                alternates={alternates}
                onAdd={onAddAlternate}
                onDelete={onDeleteAlternates}
              />
            )}

            {isOverriding ? (
              <Button
                onClick={() => setIsOverriding(false)}
                size="lg"
                color="neutral"
              >
                Nevermind... it's not important
              </Button>
            ) : (
              <Button
                onClick={onOverride}
                size="lg"
                variant="plain"
                color="danger"
              >
                Nope! I wanna go to {hostname}
              </Button>
            )}
          </Stack>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}

export default App;
