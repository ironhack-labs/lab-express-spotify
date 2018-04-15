const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '6ceecc169d06466ea07bca7aba2b96e8',
    clientSecret = 'bd20e9f046194733a80ed6f3ac28ebce';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");
hbs.registerPartials(__dirname + '/views/partials');

app.get("/", (req,res,next) => {
  res.render("home-page");
});

app.get("/search", (req,res,next) => {
  let artistSearch = req.query.artist;
 //console.log(artistSearch)
  spotifyApi.searchArtists(artistSearch)
  .then( data => {
   //console.log('Search Artist:', data.body.artists.items);
   let artistItems =  data.body.artists.items;
    res.render("artists",{ artist:artistItems});
    })
  .catch( err => {
    console.error(err);
  });
});
app.get("/albums/:artistId", (req,res) => { 
  let artParam = req.params.artistId; 
 // console.log("artistID",artParam)
  spotifyApi.getArtistAlbums(artParam)
    .then( data => {
    //  console.log('Artist albums', data.body.items);
      let albumsItems = data.body.items;      
      res.render("albums",{ album: albumsItems});
    })
    .catch( err => {
      console.error(err);
    });
});
app.get("/tracks/:albumId", (req,res) => { 
  let albParam = req.params.albumId; 
  console.log("albumID:",albParam)
  spotifyApi.getAlbumTracks(albParam)
    .then(data => {
     // console.log('album tracks', data.body.items);
      let tracksItems = data.body.items;      
      res.render("tracks",{ track: tracksItems});
      })
    . catch(err => {
      console.error(err);
      });
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {    
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, () => {
  console.log("App is running!");
  
});