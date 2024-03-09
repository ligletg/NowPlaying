const express = require("express");
const request = require("request");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = "http://localhost:3000/callback";

let accessToken;

app.get("/preview", (req, res) => {
  //serve public/index.html
  res.sendFile(__dirname + "/public/index.html");
});

// Route to initiate authentication
app.get("/", (req, res) => {
  const scope = "user-read-currently-playing"; // Specify required scopes
  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
  );
});

// Callback route after Spotify authentication
app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      res.redirect("/preview");
    } else {
      res.send("Error: " + error);
    }
  });
});

// Route to get the currently playing song
app.get("/currently-playing", (req, res) => {
  const options = {
    url: "https://api.spotify.com/v1/me/player/currently-playing",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    json: true,
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const albumCover = body.item.album.images[0].url;
      const artist = body.item.artists[0].name;
      const song = body.item.name;
      const songDuration = body.item.duration_ms;
      const previewUrl = body.item.preview_url;
      const songProgress = body.progress_ms;
      const progressPercentage = (songProgress / songDuration) * 100;
      res.json({
        albumCover: albumCover,
        artist: artist,
        song: song,
        progressPercentage: progressPercentage.toFixed(2),
        previewUrl: previewUrl,
      });
    } else {
      res.send("Error: " + error);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
