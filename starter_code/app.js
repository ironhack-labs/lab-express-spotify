const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//route for the pages
app.get("/", (req, res) => {
    res.render("search");
});
app.get("/albums", (req, res, next) => {
    const { id } = req.query;
    spotifyApi.getArtistAlbums(id).then(
        function(data) {
          
           console.log('albums', data.body.items);
           res.render("albums", { albums: data.body.items });
        },
        function(err) {
            console.error(err);
        }
    );
});

//get trancks
app.get("/tracks",(req, res)=>{

 const {id} =req.query
 console.log("artist query param", id);
 spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
  .then(function(data) {
      console.log(data)
    res.render("tracks", { tracks: data.body.items });
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.get("/artists", (req, res) => {
    const { artist } = req.query;
    console.log("artist query param", artist);
    spotifyApi
        .clientCredentialsGrant()
        .then(data => {
            spotifyApi.setAccessToken(data.body["access_token"]);
            spotifyApi
                .searchArtists(artist)
                .then(data => {
                    res.render("artists", { artists: data.body.artists.items });
                })
                .catch(err => {
                    console.log("The error while searching artists occurred: ", err);
                });
        })
        .catch(error => {
            console.log("Something went wrong when retrieving an access token", error);
        });
});

// Retrieve an access token
const clientId = "2fad7a637b454c8d8918f3ad41280395";
clientSecret = "c268d30568ee48808ec3a129ed6a5d1b";

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// the routes go here:

// display results for artist search

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
