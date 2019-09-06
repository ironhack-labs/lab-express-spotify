const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

// Remember to insert your credentials here
const clientId = 'd431f2861b504dbab9082ed0b856368f',
  clientSecret = 'c69505b908ea4949a96b8130ce30e67f';

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




// require spotify-web-api-node package here:

const searchArtist = (req, res) => {
  spotifyApi.searchArtists(req.query.searchedartist)
    .then(data => {
      res.render('artists', {
        data: data.body.artists.items
      })
      console.log("The received data from the API: ", data.body);

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
}

const artistId = (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function (data) {
      res.render('albums', {
        data: data.body.items
      })
      console.log('Artist albums', data.body);
    }, function (err) {
      console.error(err);
    });

}

const albumTracks = (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumTracks)
    .then(function (data) {
      res.render('tracks', {
        data: data.body.items
      })
      console.log('album tracks', data.body);
    }, function (err) {
      console.error(err);
    });

}


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
const index = (req, res) => {
  res.render('index')
}
hbs.registerPartials(`${__dirname}/views/partials`)

// setting the spotify-api goes here:






// the routes go here:
app.get('/', index)
app.get('/artists', searchArtist)
app.get('/albums/:artistId', artistId)
app.get('/tracks/:albumTracks', albumTracks)

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));