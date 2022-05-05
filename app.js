require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


  // Our routes go here:

app.get('/', (req, res) => {
  res.render('home')
});


app.get('/artist-search', async (req, res) => {
  try {
    const data = await spotifyApi.searchArtists(req.query.artist);
    const artistsData = data.body.artists.items;

    res.render('artist-search', {artistsData})

  }
    catch (err) {
      console.error(err)
    }
  
})

app.get('/albums/:id', (res, req)=> {
  try{
    const data = await spotifyApi.getArtistAlbums(request.params.id);
    console.log(data)

  res.render('albums')
  }
  catch (err) {
    console.error(err)
  }
})










app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


