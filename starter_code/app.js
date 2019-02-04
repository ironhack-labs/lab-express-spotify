const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = "269be22573764fcea1917321147c5688",
  clientSecret = "b2842f89c08444fa8011dba906725f3e";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

// INDEX ROUTE
app.get("/", (req, res, next) => {
  res.render("index");
});

// ARTIST ROUTE - linked to artist.hbs - receiving the user input through artistName
app.get("/artist", (req, res, next) => {
  const {artistName} = req.query;
  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      // res.json(data); // To check the data structure received from the API
      console.log("The received data from the API: ", data.body); 
      res.locals.artistList = data.body.artists.items; // To pass the data to the .hbs
      res.render("artist"); // Call the .hbs template
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

// ALBUM ROUTE - linked to albums.hbs - receiving the ID from the URL
// "/album/:id" tells to express to recover the parameter from the URL, passed by the link <a> in artist.hbs
// req.params method is used to get that parameters and pass it to the API
app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      //res.json(data.body.items);
      // BE carefull : the structure has changed from what we recover in the previous route
      // Always check the data structure fetched using the above command (res.json(data))
      res.locals.albums = data.body.items; 
      console.log("Artist albums", data.body);
      res.render("albums")
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

// TRACKS ROUTE - linked to tracks.hbs - receiving the ID from the URL
// "/tracks/:id" tells to express to recover the parameter from the URL, passed by the link <a> in artist.hbs
// req.params method is used to get that parameters and pass it to the API
app.get("/tracks/:id",(req,res,next) => {
  const {id} = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      // res.json(data.body.items);
      res.locals.tracks = data.body.items;
      console.log("Artist albums", data.body);
      res.render("tracks")
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
})


app.listen(5555, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
