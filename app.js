require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


  // Our routes go here:
app.get('/', (req, res) => res.render('index'));
app.get('/layout', (req, res) => res.render('layout'));



//rota dos tracks
app.get( '/view-track/:trackId', (req, res ) => {
    const track = req.params.trackId
    spotifyApi
    .getAlbumTracks(track)
    .then(data => {
        // res.send(data)
        const track  = data.body.items
     res.render('view-track', {track})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})



//rota dos albums
app.get( '/albums/:artistId', (req, res ) => {
    const albums = req.params.artistId
    spotifyApi
    .getArtistAlbums(albums)
    .then(data => {
        const albums = data.body.items
     res.render('albums', {albums})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
} )

//rota dos artistas
app.get('/artist-search', (req, res) => {
    const query = req.query.search
    // res.render('artist-search', {query}) 
    spotifyApi
  .searchArtists(query)
  .then(data => {
    // res.send(data.body.artists.items);
    const artist = data.body.artists.items;
    res.render('artist-search-results', {artist}) 
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
