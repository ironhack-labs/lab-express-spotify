require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) =>{
  res.render('home');
})

app.get('/artist-search', async (req, res) => {
  const { artistName } = req.query;

  try {
    const { body: { artists: { items} } } = await spotifyApi.searchArtists(artistName)  
    res.render('artist-search-results', {items})
  } catch (error) {
    console.log(error)
  }
})

app.get('/albums/:artistId', async (req, res) => {
  const { artistId } = req.params;
  
  try {
    const { body: { items} } = await spotifyApi.getArtistAlbums(artistId);

    res.render('albums', {items});
    
  } catch (error) {
    console.log(error);
  }
  

})

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));

