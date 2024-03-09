function fetchData() {
  fetch("/currently-playing")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      updateAlbumCover(data.albumCover);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      //autologin
      window.open("http://localhost:3000/", "_self");
    });
}

function updateAlbumCover(albumCover) {
  const img = document.querySelector("#album-cover");
  img.src = albumCover;
  img.crossOrigin = "Anonymous";

  const colorThief = new ColorThief();
  if (img.complete) {
    const color = colorThief.getColor(img);
    updateBackgroundColor(color[0], color[1], color[2]);
  } else {
    img.addEventListener("load", function () {
      const color = colorThief.getColor(img);
      updateBackgroundColor(color[0], color[1], color[2]);
    });
  }
}

function updateBackgroundColor(red, green, blue) {
  const color = `rgb(${red}, ${green}, ${blue})`;
  const el = document.querySelector("#preview");
  el.style.backgroundColor = color;
}

// Call fetchData every second
setInterval(fetchData, 1000);
