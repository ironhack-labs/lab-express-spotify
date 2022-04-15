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

app.get('/', function (req, res){
    res.render('home');
})

app.get('/artist-search', function (req, res){
    const queryString = req.query.query

    spotifyApi
    .searchArtists(queryString)
    .then(function(data) {
        console.log(`Search artists by ${queryString}`, data.body.artists.items);
        
        let resultFromApi = data.body.artists.items
        // for (let result of resultFromApi){
        //     let albumImage = result.images[0]
        //     console.log(albumImage)
        // }
        // console.log(resultFromApi)
    
       res.render('artist-search-result', { artistList: resultFromApi})
    
    })
    .catch(function(err){
        console.log(err)
    })
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    let artistId = req.params.artistId
 
    spotifyApi
    .getArtistAlbums(artistId)
    .then(function(data) {
            console.log('Artist albums', data.body.items);

            let albums = data.body.items

          res.render('albums', { artistAlbums: albums })
        })
    .catch(function(err){
        console.log(err)
    })
  });


app.get('/tracks/:albumId', (req, res, next) => {

    let albumId = req.params.albumId

    spotifyApi
    .getAlbumTracks(albumId, { limit : 5, offset : 1 })
    .then(function(data) {
      console.log('album tracks', data.body.items);

      let tracks = data.body.items

      for (let track of tracks){
          console.log(track.preview_url)
      }

      res.render('tracks', { albumTracks: tracks})

    })
    .catch(function(err) {
      console.log('Something went wrong!', err);
    });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
