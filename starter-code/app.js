require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))

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

app
    .get('/', (req, res) => {
        res.render('index')
    })
    .get('/artist-search', (req, res) => {
        
        const artistQuery = req.query

        spotifyApi
            .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/ artistQuery.artist )
            .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items[0].name);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
                const artistsArr = data.body.artists.items

                res.render('artist-search-results', {artistsArr})

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

    })
    .get('/albums/:artistId', (req, res, next) => {
        // .getArtistAlbums() code goes here

        const { artistId } = req.params

        spotifyApi
            .getArtistAlbums(artistId)
            .then(albums => {
                console.log('The received albums from the API: ', albums.body.items);
                const albumsArr = albums.body.items

                res.render('album', {albumsArr})
            })
    })
    .get('/tracks/:albumId', (req, res, next) => {
        // .getArtistAlbums() code goes here

        const { albumId } = req.params

        spotifyApi
            .getAlbumTracks(albumId)
            .then(tracks => {
                console.log('The received albums from the API: ', tracks.body);
                const tracksArr = tracks.body.items

                res.render('tracks', {tracksArr})
            })
    })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
