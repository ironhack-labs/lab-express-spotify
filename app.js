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
app.get("/", (req, res)=> {
    res.render("home-page");
})
app.get("/artist-search-results", (req, res) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
    const artists = data.body.artists.items;
    // wanted to know how to get the image:
    // artists.forEach((element) => {
    //   console.log(element.images[0])
    // })
    res.render("artist-search-results", {artists} )
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:artistId', (req, res) => {
  // console.log(req.params)
  // console.log(req.params.artistId)
  const artistId = req.params.artistId;
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    //console.log('Artist albums', data.body.items);
    const albums = data.body.items;
    //console.log(albums[0].artists[0].name)
    const artistName = albums[0].artists[0].name;
    //console.log(artistName);
    // albums.forEach((element) => {
    //   console.log(element.artists[0].name)
    // })
    res.render("albums", {albums,artistName});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/tracks/:trackId', (req, res) => {
  // console.log(req.params)
  // console.log(req.params.trackId)
  const trackId = req.params.trackId;
  spotifyApi
  .getAlbumTracks(trackId) 
  .then(data => {
    const tracks = data.body.items;
    //console.log('tracks:', tracks);
    // tracks.forEach((element) => {
    //   console.log(element.preview_url)
    // })
    res.render("tracks", {tracks})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


  


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
