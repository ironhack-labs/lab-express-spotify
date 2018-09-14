const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '64b83a4d756241d7a4715910fe0571cb',
    clientSecret = '96a289118cc74cdf81a9671f286fb95e';
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => { console.log(data.body.artists.items)
    res.render('artists', {data});
})
    .catch(err => {
    })
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => { console.log('Artist albums', data.body.items)
    res.render('albums', {data});
})
    .catch(err => {
    })
  });

  app.get('/track/:trackId', (req, res) => {
   spotifyApi.
   getAlbumTracks(rec.params.trackId)
   .then(data => {console.log("tracks", data.body.items.total_tracks) 
   res.render('tracks', {data});
}) 
.catch(err => {// code
  })
});

app.listen(3000, () => {
    console.log("port 3000")
});



