require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
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
app.get("/",  (req, res) => {
    console.log("request on index")
    res.render("index")
})

app.get("/artist-search", (req, res) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log('The received data from the API: ', data)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artistsFromApi = {
        artists: data.body.artists.items
    }
    console.log("artist.items:", data.body.artists)
    console.log("artist.url:", data.body.artists.items[0].images[0].url)
    res.render("artist-search-results", artistsFromApi)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) =>{
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) =>{
        const foundAlbums = {
            albums: data.body.items
        }
        console.log (foundAlbums)
        res.render('albums', foundAlbums)
    })
    .catch((err) =>
    console.log ('The error while searching albums occurred: ', err))
})

app.get('/albums/tracks/:trackId', (req, res, next) =>{
    spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((data) =>{
        const albumTracks = {
            tracks : data.body.items
        }
        console.log (data.body.items)
        res.render('tracks', albumTracks)
    })
    .catch((err) =>
    console.log ('The error while searching album tracks occurred: ', err))
})

app.listen(3003, () => console.log('My Spotify project running on port 3003 🎧 🥁 🎸 🔊'));



  