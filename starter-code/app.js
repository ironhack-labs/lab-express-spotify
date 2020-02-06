require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');

app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));


// add the routes here:
app.get('/', (req, res) => res.render('home'));

// app.get('/beers', (req, res) => res.render('beers', ))


app.get(`/artist-search`,(req, res, next)=>{
    let {artist} = req.query
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    const artistSearch = data.body.artists.items;
    res.render(`artist-search-results`,{artistSearch})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get(`/albums/:artistId`,(req, res, next)=>{
    let artistId = req.params.artistId
    console.log(artistId)
    spotifyApi.getArtistAlbums(artistId)
    .then(data=>{
        const albumsSearch = data.body.items;
        res.render(`albums`, {albumsSearch})   
})
.catch(err => console.log('The error while searching artists occurred: ', err));
})




app.get(`/tracks/:albumId`,(req, res, next)=>{
    let albumId = req.params.albumId
    console.log(albumId)
    spotifyApi.getAlbumTracks(albumId)
  .then(data=>{
        const tracksSearch = data.body.items;
        // res.json( data)   
        res.render(`tracks`, {tracksSearch})
})
.catch(err => console.log('The error while searching artists occurred: ', err));
})











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

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
