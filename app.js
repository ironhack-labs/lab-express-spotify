require('dotenv').config();

const { request } = require('express');
const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get('/', (req, res) => {
   res.render('index')
});


app.get('/artist-search', (req,res) => {
  //res.send(req.query.q)
  spotifyApi
      .searchArtists(req.query.q)
      .then(artistsInfo => {
          console.log('The received data from the API: ', artistsInfo.body.artists.items[0].images);
          res.render('artist-search-results', { artistList: artistsInfo.body.artists.items})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req,res,next) => {
  spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then((artistData) => {
        console.log('The received data from the API: ',artistData.body.items);
        res.render('albums', {artistAlbum: artistData.body.artists.items})
        // the line above is not working
         
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
