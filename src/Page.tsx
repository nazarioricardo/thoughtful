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
type PageProps = {
  url: string;
};

function Page({ url }: PageProps) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [alternates, setAlternates] = useState<string[]>([]);
  const hostname = getHostName(url);

  const onAddAlternate = async (alternate: string) => {
    const oldAlternates = alternates.filter((alt) => alt !== alternate);
    const newAlternates = [...oldAlternates, alternate];

    setAlternates(newAlternates);
    const store = await Browser.storage.sync.get([url]);
    const data = store[url];
    await Browser.storage.sync.set({
      [url]: {
        ...data,
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

    Browser.storage.sync.get(["visiting"]).then((result) => {
      console.log(result.visiting);
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

export default Page;
