function fetchData() {
  fetch("/currently-playing")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      updateAlbumCover(data.albumCover);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function updateAlbumCover(albumCover) {
  var targetDiv = document.querySelector("#album-cover");
  var url = targetDiv.parentNode.href;
  targetDiv.style.backgroundImage = "url(" + albumCover + ")";
}

// Call fetchData every second
setInterval(fetchData, 1000);
