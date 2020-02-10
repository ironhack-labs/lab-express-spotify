require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
// This creates an object with your ID at Spotify
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// This is middleware: app.use
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) =>{
    spotifyApi
    .searchArtists(artist)  // instead of (req.query.artist) ??
    .then(response => {
        console.log('The received data from the API: ', data.body.artists.items) // This comes out of the 'data'
        const data = {
            artists: data.body.artists.items
        };
        
        // data.body.artists.items.forEach((item) => 
        // console.log(item.images))
        // const artistsArray = data.body.artists.items
        res.render('artist-search-results', {artistsArray}) //???
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => { // any param in the GET is available under re.params.<request>: here"artistId"
    const artistId = (req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId) // this comes from req.params.artistId
    .then(response => {
          // console.log('Artist albums', data.body)

          const data = {
              albums: response.data.albums
            }
          res.render('albums', {albums})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    //req.params.albumId
    //const albumId = (req.params.albumId)

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(response => {
    console.log('Album tracks', response.body.items);

    const tracks = {
            tracks: response.body.items
        }
    res.render('tracks', data)
    })

    .catch(err => console.log('The error while searching artists occurred: ', err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
