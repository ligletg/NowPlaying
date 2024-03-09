var currentSong = "";

function fetchData() {
  fetch("/currently-playing")
    .then((response) => response.json())
    .then((data) => {
      if (hasSongChanged(data.song)) {
        updateAlbumCover(data.albumCover);
        updateColors();
        updateSongDetails(data.artist, data.song, data.album);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function hasSongChanged(newSong) {
  if (newSong !== currentSong) {
    currentSong = newSong;
    return true;
  } else {
    return false;
  }
}

function updateAlbumCover(albumCover) {
  const img = document.querySelector("#album-cover");
  img.src = albumCover;
  img.crossOrigin = "Anonymous";
}

function updateColors() {
  const img = document.querySelector("#album-cover");
  const colorUpdater = (img) => {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(img);
    const palette = colorThief.getPalette(img, 8);
    updateBackgroundColor(color[0], color[1], color[2]);

    const contrastColor = getContrastColor(palette, [
      color[0],
      color[1],
      color[2],
    ]);

    updateForegroundColor(contrastColor[0], contrastColor[1], contrastColor[2]);
  };

  if (img.complete) {
    colorUpdater(img);
  } else {
    img.addEventListener("load", function () {
      colorUpdater(img);
    });
  }
}

function updateBackgroundColor(red, green, blue) {
  const color = `rgb(${red}, ${green}, ${blue})`;
  const body = document.querySelector("body");
  body.style.backgroundColor = color;
}

function updateForegroundColor(red, green, blue) {
  const color = `rgb(${red}, ${green}, ${blue})`;
  const body = document.querySelector("body");
  body.style.color = color;
}

function updateSongDetails(artist, song, album) {
  document.querySelector("#artist").textContent = artist;
  document.querySelector("#song").textContent = song;
  document.querySelector("#album").textContent = album;
}

// Call fetchData every second
setInterval(fetchData, 1000);
