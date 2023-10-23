import { useEffect, useState } from "react";
import Chrome from "webextension-polyfill";
import { CssVarsProvider, Sheet, Stack, Typography } from "@mui/joy";
import Alternates from "./components/Alternates";
import { getHostName } from "./constants";
type AppProps = {
  url: string;
};

// jim carry "Do Not Go In There!"
// Jurassic Park "You didn't say the magic word!"
// Larry David "How did I end up here?"

// const useAbortController = (url: string, data: object, dependencies: any[]) => {
//   const abortController = new AbortController();
//   useEffect(() => {
//     const { signal } = abortController;
//     fetch(url, { signal, ...data })
//       .then((response) => {
//         return response;
//       })
//       .catch((error) => {
//         if (error.name === "AbortError") {
//           console.log("Operation aborted");
//           return;
//         }

//         throw error;
//       });

//     return () => {
//       abortController.abort;
//     };
//   }, [...dependencies]);
// };

function App({ url }: AppProps) {
  const [alternates, setAlternates] = useState<string[]>([]);
  const hostname = getHostName(url);

  const onAddAlternate = async (alternate: string) => {
    const oldAlternates = alternates.filter((alt) => alt !== alternate);
    const newAlternates = [...oldAlternates, alternate];

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
        <Sheet sx={{ height: "100vh", width: "100vw" }}>
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
