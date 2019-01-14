const express         = require('express');
const app             = express();
const hbs             = require('hbs');
const SpotifyWebApi   = require('spotify-web-api-node');
const bodyParser      = require('body-parser');
const path            = require("path")

hbs.registerPartials(__dirname + '/views/partials');


// Remember to paste your credentials here
let clientId = 'bbef28f687ea40b3ac7adac3eebcb8fd',
    clientSecret = '3c5f5252004140f881a395d31036b0f2';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res, next) =>{

  res.render('index');
})

app.get("/artists", (req, res, next) =>{
  let artist = req.query.artist
  spotifyApi.searchArtists(artist)
    .then(data => {
      let artistInfo = data.body.artists.items
      res.render("artists", {artistInfo})
    })
    .catch(err => {
      console.log(err);
    })
})


app.get("/albums/:artistId", (req, res) =>{
  let artistId = req.params.artistId

  spotifyApi.getArtistAlbums(artistId)
  .then(data =>{
    res.render("albums", { albums: data.body.items})
  })
  .catch(err => console.log(err))
})

app.get("/tracks/:trackId", (req, res) =>{

  let trackId = req.params.trackId;

  spotifyApi.getAlbumTracks( trackId , {limit :50,  offset: 0})
  .then(data =>{
    res.render("tracks", {tracks: data.body.items})
  })
  .catch(err => console.log(err))
})

app.listen(3000, ()=>{
  console.log("Running on port 3000");
})