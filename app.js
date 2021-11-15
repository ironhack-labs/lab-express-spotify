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
app.get('/', (req, res) =>{
    res.render('home.hbs')
})

app.get('/artist-search', (req, res) =>{
    console.log(req.query.artist)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const artists = data.body.artists.items;
            // console.log('The received artist from the API: ', artists);
            
            res.render('artistSearchResults.hbs', { artists });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums((req.params.artistId))
    .then(albums => {
        // console.log('Artist albums', albums.body);
        const artistAlbums = albums.body.items;
        // console.log("esto", artistAlbums)
        res.render('albums.hbs', { artistAlbums });
    }) 
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/view-tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
    .then(tracks => {
    //   console.log(tracks.body);
      const tracksAlbum = tracks.body.items
      console.log(tracksAlbum);
      res.render('viewTracks.hbs', { tracksAlbum });
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


