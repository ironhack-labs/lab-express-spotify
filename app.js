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

// Our routes go here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    app.get('/', (req, res) => {
        res.render('index');
      });

    app.get('/artist-search', (req, res, next) => { 
    spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items[0].images);
        res.render('artist-search-results.hbs',{results:data.body.artists.items});
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
      .catch(err => console.log('The error while searching artists occurred: ', err));

    })

    app.get('/albums/:artistId', (req, res, next) => { 
        spotifyApi
          .getArtistAlbums(req.params.artistId)
          .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('albums.hbs',{albums:data.body.items});
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
          .catch(err => console.log('The error while searching artists occurred: ', err));
    
    })


    app.get('/tracks-information/:tracksId', (req, res, next) => { 
        spotifyApi
          .getAlbumTracks(req.params.tracksId)
          .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('tracks-information.hbs',{tracks:data.body.items});
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
          .catch(err => console.log('The error while searching artists occurred: ', err));
    
    })

    app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
