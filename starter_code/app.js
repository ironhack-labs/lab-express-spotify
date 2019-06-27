require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Remember to insert your credentials here
const clientId = process.env.CLIENTID,
clientSecret = process.env.CLIENTSECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get("/", (req, res) => {
  res.render("index")
})

app.post("/artist", (req, res) => {
  spotifyApi.searchArtists(req.body.artist)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    
    res.render("artist", {artists:data.body.artists.items})  
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      console.log('Artist albums', data.body.items);
      res.render("albums",  {albums:data.body.items})
      
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function(data) {
      console.log('Artist tracks', data.body.items); 
      res.render("tracks", {tracks:data.body.items})
      //res.json(data.body)
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));