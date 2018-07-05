var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    //console.log(req.query);
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            //console.log(data.body.artists.items);
            var allResults = data.body.artists.items;
            res.render('artists', { info: allResults });
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/albums/:artistId', (req, res) => {
    var arId = req.params.artistId;
    //console.log(arId);
    spotifyApi.getArtistAlbums(arId)
    .then(data=>{
        //console.log(data.body.items);
        var allAlbums = data.body.items;
        res.render('albums', {albuminfo: allAlbums});
    })
    .catch(err=>{
        console.log(err);
    })
});

app.get('/tracks/:albumId', (req,res) =>{
    var albId = req.params.albumId;
    spotifyApi.getAlbumTracks(albId)
    .then(data=>{
        console.log(data.body.items);
        var allTrakcs = data.body.items;
        res.render('tracks',{trackinfo: allTrakcs});
    })
    .catch(err=>{
        console.log(err);
    })
})

// Remember to paste here your credentials
var clientId = '8c5bbbcf4fe7491491ec1ed5f248e71f',
    clientSecret = '0deacf7ed6a84ff780ac82196a94884a';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.listen(3000, () => {
    console.log("My first app listening on port 3000!");
});

