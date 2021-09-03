require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get('/', (req, res, next) => {
        res.render('index');
    
    });

app.get('/artist-search', (req, res, next) => {
    let artistObj = req.query;
    let artistName = artistObj.artist

    spotifyApi
            .searchArtists(artistName)
            .then(data => {
                 console.log('The received data from the API: ', data.body);

                  let totalArtistsArr = (data.body.artists.items)

                  res.render('artist-search-results', {totalArtistsArr})
            })
            .catch(err => console.log('The error while searching artists occurred: ', err))
    });

app.get('/albums/:artistId', (req, res, next) => {
    let artistID = req.params.artistId;

    spotifyApi
            .getArtistAlbums(artistID)
            .then(album => {

                let totalAlbumsArr = (album.body.items)

                res.render('albums', {totalAlbumsArr})
         })
      });

app.get('/tracks/:albumID', (req, res, next) => {
    let albumID = req.params.albumID;

    spotifyApi
            .getAlbumTracks(albumID)
            .then(track => {

                let tracksArr = (track.body.items)
                res.render('tracks', {tracksArr})
         })

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
