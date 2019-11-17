require('dotenv').config(); // what this does is to avoid making our API keys public by adding and commitng it

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// SET THE DIRECTORY USED TO SERVE PARTIALS
hbs.registerPartials(__dirname + '/views/partials');
// register hbs helper to use a compare function in artist.hbs
hbs.registerHelper('greaterThan', function (v1, v2, options) {
  'use strict';
     if (v1>v2) {
       return options.fn(this);
    }
    return options.inverse(this);
  });

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

  // Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


// the routes go here:

// GET ARTISTS
app.get('/artists', (req,res,next) => {
  console.log('artist searched -->', req.query.artist);
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    console.log("The received data from the API: ", data.body.artists.items);
    // console.log('img --> ', data.body.artists.items[0].images);
    res.render('artists', { artistsObj: data.body.artists.items, artistSearched: req.query.artist});
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})

// GET ALBUMS
app.get("/albums/:artistId", (req, res, next) => {  
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('albums', {albumsObj: data.body.items, groupName: data.body.items[0].artists[0].name});
    //console.log('album id: ', data.body.items[0].id);
  })
  .catch(err => {
    console.log("The error while searching artist albums occurred: ", err);
  });
});

// GET TRACKS OF ALBUM
app.get("/tracks/:albumId", (req, res, next) => {  
  console.log(req.params.albumId);
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    res.render('tracks', {tracksObj: data.body.items});
    //console.log('album id: ', data.body.items[0].id);
  })
  .catch(err => {
    console.log("The error while searching artist albums occurred: ", err);
  });
});

app.get('/', (req, res, next) => {
  res.status(200).render('home');
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
