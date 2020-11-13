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
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {spotifyApi.setAccessToken(data.body['access_token'])
    console.log();
})
 
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.q.toLowerCase())
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists);
    res.render('artist-search-results', {artist: data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// app.get('/movies/:title', (req,res) => {
  
//     // console.log(req.params.title);
//     const movie = movies.find(movie => movie.title === req.params.title)
//     res.render('movieDetails', {chosenMovie: movie });
//   })
  

app.get('/albums/:id', (req, res) =>{
    // console.log(req.params.id);
    spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
        // console.log(data.body.items[0].images[0].url);
        res.render('albums', {album: data.body.items})
    })
})

app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(data =>{
        console.log(data.body.items);
        res.render('tracks', {track: data.body.items})
    })
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);