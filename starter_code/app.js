const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "82b7d3d45d184ec6b6f4f7448a1aa301",
  clientSecret = "db4f3abe85834be083261682526fab1f";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
//   console.log(req.query);
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let artists = data.body.artists.items;
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
    //   console.log("Artist albums", data.body);
      let albums = data.body.items;
      res.render("albums", { albums });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:trackId",(req,res,next)=>{
    // console.log(req.params.trackId)
    spotifyApi.getAlbumTracks(req.params.trackId).then(data=>{
        // console.log("Tracks List:",data.body.items)
        let tracks=data.body.items
        res.render("tracks",{tracks})
    })
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
