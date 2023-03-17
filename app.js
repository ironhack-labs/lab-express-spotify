require("dotenv").config();
const bodyParser = require("body-parser")
const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (require, response, next) => {
  response.render("home");
});

 app.post('/artist-search', (request, response, next)=>{

    const artistName = request.body.artist
    spotifyApi
      .searchArtists(artistName)
      .then((data) => {
        response.render("artist-search-results", data.body.artists)
     })
     .catch((err) =>
     console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:id', (request, response, next)=>{
    const artistsId = request.params.id
    spotifyApi
    .getArtistAlbums(artistsId)
    .then((data)=> {
      response.render("albums",data.body)
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
})

app.get('/tracks/:id', (request, response, next)=>{
    const trackId = request.params.id
    spotifyApi.getAlbumTracks(trackId)
    .then((data)=>{
      console.log(data.body);
      response.render("tracks", data.body)
    })
    .catch(()=>{
      console.log('Something went wrong!', err);
    });
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
