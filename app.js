require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("home", {doctitle: 'home'});
});

app.get("/artist-search", (req, res) => {
    spotifyApi
  .searchArtists(req.query.q.toLowerCase())
  .then(data => {
    res.render("artist-search", {artist: data.body.artists.items, doctitle: 'artist'} );
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));  
  });

  app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Album information', data.body);
    res.render('albums', {albums: data.body.items, doctitle: 'Albums of the Artist'})
  }, function(err) {
    console.error(err);
  });
  });


  app.get("/tracks/:albumId", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      
      
      spotifyApi.getAlbum(req.params.albumId)
      .then(function (data2){
        //console.log('crazyyyy', data.body.name)
        res.render("tracks", {tracks: data.body.items, album: data.body.items[0].name, doctitle: 'Tracks of the Album', albumName: data2.body.name});
        
      })

     
    }, function(err) {
      console.log('Something went wrong!', err);
    });
    
  });
  


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
