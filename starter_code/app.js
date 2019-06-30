const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '146eb9701f1e434d87c21038ea569fd8';
const clientSecret = '08f4e31a5dd54f33afe25a864769b021';
// require spotify-web-api-node package here:
var Spotify = require('spotify-web-api-js');
var s = new Spotify();

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getImg", x => {
    return x.images[0]?x.images[0].url:null;
});

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
.then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
})

// the routes go here:
app.get('/', (req,res) => {
    res.render('index');
});

app.get("/search/",(req, res) => {
    // console.log(req.query);
    spotifyApi.searchArtists(req.query.q)
    .then(data => {
        //body(Obj) > artists(Obj) > href(String) - items(array of Obj)
        let list = data.body.artists.items.slice(0,6);
        res.render('artists', {list});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get("/albums/:artistId", (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        let list = data.body.items.slice(0,6);
        res.render('albums', {list})
        }, err => {
        console.error(err);
    });
})

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit : 10, offset : 1 })//4Ij3ebiLWqJ29SqPUym5xQ
    .then(function(data) {
        let list = data.body.items.map(e => Object.assign({
            name: e.name,
            preview_url: e.preview_url}));
        res.render('previews', {list});
    }, function(err) {
        console.log('Something went wrong!', err);
    });
})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));


/*
[ { artists: [ [Object] ],
    available_markets:
     [ 'ZA' ],
    disc_number: 1,
    duration_ms: 192053,
    explicit: false,
    external_urls:
     { spotify: 'https://open.spotify.com/track/6lynokJ0Ilm55qB4FdVeG7' },
    href: 'https://api.spotify.com/v1/tracks/6lynokJ0Ilm55qB4FdVeG7',
    id: '6lynokJ0Ilm55qB4FdVeG7',
    is_local: false,
    name: 'She\'s A Woman - Live / Remastered',
    preview_url: null,
    track_number: 2,
    type: 'track',
    uri: 'spotify:track:6lynokJ0Ilm55qB4FdVeG7' },
  { artists: [ [Object] ],
    available_markets:
     [ 'PA'],
    disc_number: 1,
    duration_ms: 219733,
    explicit: false,
    external_urls:
     { spotify: 'https://open.spotify.com/track/510F0QzxgNnfAVcCrYG2cv' },
    href: 'https://api.spotify.com/v1/tracks/510F0QzxgNnfAVcCrYG2cv',
    id: '510F0QzxgNnfAVcCrYG2cv',
    is_local: false,
    name: 'Dizzy Miss Lizzy - Live / Remastered',
    preview_url: null,
    track_number: 3,
    type: 'track',
    uri: 'spotify:track:510F0QzxgNnfAVcCrYG2cv' } ]
*/