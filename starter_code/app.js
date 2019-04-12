const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '61b9b544b29642f6ade24a524617feef',
    clientSecret = 'ee1d0db98b324a10be6ac6180175f6e0';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
        //res.json(data)
        //console.log("The received data from the API: ", data.body.artists.items);
        res.render('artists', {data: data.body.artists.items})
    })
    .catch(err => {
        console.log("Something went wrong. Error searching artists: ", err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        //res.json(data)
        res.render("albums", {data: data.body.items});
    })
    .catch(err => {
        console.log("Something went wrong. Error searching albums: ", err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        res.render("tracks", {data: data.body.items});
     })
    .catch(err => {
        console.log("Something went wrong. Error searching tracks: ", err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
