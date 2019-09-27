require('dotenv').config()
const express = require('express');
const app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
hbs.registerPartials(__dirname + '/views/partials');
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
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
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist', (req, res) => {
const { nameArtist } = req.query
spotifyApi
  .searchArtists(nameArtist)
  .then(data => {
    console.log("The received data from the API: ", data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const { items } = data.body.artists;
    res.render('artist', { items });
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const chooseArtist = req.params;
  console.log("idArtist: ", chooseArtist);  
spotifyApi
  .getArtistAlbums(chooseArtist.artistId)
  .then(data => {
    console.log("The received data from the API: ", data.body.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const { items } = data.body;
    res.render('albums', { items });
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})

app.get("/tracks/:albumId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const chooseAlbum = req.params;
  console.log("idAlbum: ", chooseAlbum);  
spotifyApi
  .getAlbumTracks(chooseAlbum.albumId)
  .then(data => {
    console.log("The received data from the API: ", data.body.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const { items } = data.body;
    res.render('tracks', { items });
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
