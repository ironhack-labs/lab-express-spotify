require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
//Order Matters - place above everything else
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
  //redirect URL needed here?
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

  const app = express()

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// the routes go here:
//#1: Render index.hbs
app.get('/', (req, res, next) => {
  // console.log("hello")
  res.render('index');
  //^ this is rendering the hbs file listed in the ()
});

//#2: Render artist.hbs
app.get('/artists', (req, res, next)=>{

  spotifyApi.searchArtists(req.query.artistName)
  .then(data => {
    // console.log("the data from spotify: ", {data: data.body.artists.items})
    res.render('artists', {artist: data.body.artists.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })

});

//#3: Render albums.hbs
//.getArtistAlbums - req.params.getID (or album, or whatver I call it)
app.get('/albums/:artistId', (req, res, next)=>{

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    // console.log("the data from spotify: ", {data: data.body})
    res.render('albums', {album: data.body.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })

});



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
