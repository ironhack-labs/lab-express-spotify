require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
  res.status(200).render('home');
});


app.get('/artist-search', (req, res)=>{
  spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
        res.status(200).render('artist-search-results', {artists: data.body.artists.items})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})




app.get('/albums/:artistId', (req, res, next) => {
  const {artistId} = req.params;

  spotifyApi
  .getArtistAlbums(artistId)
  .then((data)=>{ 
    const {items} =  data.body
    res.status(200).render('albums', {albums: items})
})
  .catch(err => console.log('An error while searching artists occurred: ', err));

});

app.get('/tracks/:tracksId', (req, res, next) => {
  const {tracksId} = req.params;

  spotifyApi
  .getAlbumTracks(tracksId)
  .then((data)=>{ 
    const {items} =  data.body
    res.status(200).render('tracks', {tracks: items})
})
  .catch(err => console.log('An error while searching tracks occurred: ', err));

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
