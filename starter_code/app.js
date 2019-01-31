const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '4a0cc5a1bdf84dd1b5bf1876b9ecad01',
    clientSecret = '24efc7d901644b75a6ab682db8a783e4';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })
// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index', {
        artist: req.query.artist
    })
  })
  app.get('/artists', (req, res, next) => {
   spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        let items = data.body.artists.items
        
        res.render('artists', {
            list: items
        })
    })    
  })

  app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
     .getArtistAlbums(req.params.artistId)
     .then(data => {
      let album = data.body.items;
      res.render("albums", { artistAlbums: album });
     })
     .catch(err => {
      console.log("An error occurred ARTISTID", err);
      next();
     });
   });
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
