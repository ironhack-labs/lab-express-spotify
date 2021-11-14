// DOTENV --> Install 'dotenv' to keep APY keys and credentials
require('dotenv').config();
// const dotenv = require('dotenv');

// Require Express to build the server
const express = require('express');
// HBS -> require install 'hbs' --> for layout and views
const hbs = require('hbs');


// Spotify -> require install 'spotify-web-api-node'
const SpotifyWebApi = require('spotify-web-api-node');

// Instantiate the app server
const app = express();

// HBS -> Tell Express the engine use to render views 
app.set('view engine', 'hbs');
// HBS -> Tell Express the folder to find the 'views'
app.set('views', __dirname + '/views');
// Make public folder static and available
app.use(express.static(__dirname + '/public'));

// call method of the hbs package--> registerPartials
// and as give as a parameter where are going to be the partials
hbs.registerPartials(__dirname + "/views/partials");

// Spotify -> setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Spotify ->  Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
// Our routes go here:
// Home page with search button
app.get('/', (req, res) => {
  res.render("index", {
    title: 'Main page',
  });
});

// Search and get the Artists
app.get('/artist-search', async (req, res) => {
  try {
    //http://localhost:3000/artist-search?artist=amy
    // artist --> is the 'name' or the key of the input, where the user typed the query string
    // http://localhost:3000/artist-search?artist=jack+jonhson
    const artistToFind = req.query.artist;
    //console.log(artistToFind);
     
    const data = await spotifyApi.searchArtists(req.query.artist);
    // get the data from the API, to pass it to the view 'artist-search-results'
    const artistArray = data.body.artists.items;
    //console.log('The received data from the API: ', data.body);
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // we send to this URL all the information artistArray --> in a variable named: 'artists'
    //res.send(artistArray)
    //res.send(artistArray[0].images[0].url)
    res.render('artist-search-results', {
      artists: artistArray,
      title: 'Artist page',
    });
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

// View albums after click on View Album
app.get('/albums/:artistId', async (req, res) => {
  try {
  //http://localhost:3000/albums/3GBPw9NK25X1Wt2OUvOwY3
  const id = req.params.artistId;
  const albumsResponse = await spotifyApi.getArtistAlbums(id);

  //res.send(albumsResponse)
  //res.send(albumsResponse.body.items);
  const albumsArray = albumsResponse.body.items; // to iterate over each album
  // render to 'albums.hbs', and send the data 'albums: albumsArray'
  // to access the name of the Artist, not use dot before array [] --> only inside handlebars
  const nameArtist = albumsResponse.body.items[0].artists[0].name;
  //res.send(albumsArray)
  //res.send(nameArtist)
  res.render('albums', {
    albums: albumsArray,
    artistOfAlbum: nameArtist,
    title: 'Album page',
  });
  } catch(err) {
    console.log('There is no albums to show! Try another artist!', err);
  }
})


// Track
app.get('/tracks/:id', async (req, res) => {
    
  try {
    const trackId = req.params.id;
    const data = await spotifyApi.getAlbumTracks(trackId);
    const trackArray = data.body.items;
    //res.send(trackArray);
    res.render('tracks', {
      tracks: trackArray,
      title: 'Tracks'
    })
  }
 catch(err) {
  console.error(err);
  }
});

app.get('/*', (req, res) => {
  res.render("not-render");
})


// Listen for a port
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
