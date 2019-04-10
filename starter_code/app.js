const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'dbcef883c4e14ae1b23905bd1707bf5a',
    clientSecret = '8d6a4b2d2d314beb849c7047de565f20';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:

app.get("/", (req,res) => {
  res.render("index.hbs");
});

app.get("/artists", (req,res) => {
  spotifyApi.searchArtists(req.query.name)
    .then(data => {
      // console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists.hbs", {artists : data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      // res.json(data.body.items)
      res.render("albums.hbs", {albums : data.body.items});
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      // res.json(data.body);
      res.render("tracks.hbs", {tracks : data.body.items});
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.listen(3002, () => console.log("My Spotify project running on port 3002 🎧 🥁 🎸 🔊"));
