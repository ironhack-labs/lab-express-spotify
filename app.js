require('dotenv').config();

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
    res.render('home-page');
})

app.get('/artist-search', (req, res) => {
    // console.log(req.query.artist);
    //console.log('hey');
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    const artistsResult = data.body.artists.items;
    //console.log(artistsResult);
    console.log('hello');
    const imageResult = artistsResult[0].images;
    console.log(imageResult);
  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    // const filteredArtists = onlyArtist.filter(function (artist) {
    //   return data.onlyArtist.includes(req.query.artist);
    // })
    // console.log(filteredArtists);
    res.render('artist-search-results', {artistsResult, imageResult})
  
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
