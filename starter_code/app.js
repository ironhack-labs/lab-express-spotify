const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const clientId = 'c6fe10af4cb74a5dbfd6adaaad2fe55e',
  clientSecret = 'cf518483ff3c48a198c67034d21b81e2';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:




// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
spotifyApi.searchArtists(req.query.artist)
  .then(data => {

    console.log("The received data from the API: ", data.body);
    //res.send(data.body)
    res.render('artists', {myArtists: data.body.artists.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })

});

app.get('/albums/:artistId', (req, res, next) => {
spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log("Artist Albums" + data)
    // renders the body in json format
    //res.send(data.body); 

    res.render('albums', {artistAlbums: data.body.items})
  })

  .catch(err => {
    console.log("The error while ssearching the album occurred: ", err)
  })

});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log("Album tracks " + data)
      // renders the body in json format
      // res.send(data.body); 

      res.render('tracks', { albumTracks: data.body.items })
    })

    .catch(err => {
      console.log("The error while ssearching the album occurred: ", err)
    })

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
