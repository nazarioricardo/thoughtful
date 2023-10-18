window.onload = async () => {
  console.log("onload");
  const storage = await chrome.storage.sync.get();
  console.log(storage);

  const targetUrl = location.hash.substring(1);
  console.log(targetUrl);
  // const urlParams = new URLSearchParams(window.location.search);
  // console.log("params", JSON.stringify(urlParams), window.location);
};
