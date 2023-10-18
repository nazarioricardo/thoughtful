const blockForm = document.getElementById("block-form");

function onBlockWebsite(event) {
  event.preventDefault();
  const url = document.getElementById("url").value;

  console.log(url);
}

blockForm.addEventListener("submit", onBlockWebsite);
