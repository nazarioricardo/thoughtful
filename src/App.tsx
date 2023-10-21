type AppProps = {
  url: string;
};

function App({ url }: AppProps) {
  return (
    <main>
      <h1>Do not go in there!</h1>
      <h2>{url}</h2>
    </main>
  );
}

export default App;
