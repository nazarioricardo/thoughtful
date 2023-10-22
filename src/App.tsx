type AppProps = {
  url: string;
};

// jim carry "Do Not Go In There!"
// Jurassic Park "You didn't say the magic word!"
// Larry David "How did I end up here?"

function App({ url }: AppProps) {
  return (
    <main>
      <h1>Do not go in there!</h1>
      <h2>{url}</h2>
    </main>
  );
}

export default App;
