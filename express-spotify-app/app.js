const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi;

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res, next) => {
    res.render('search-form');
})
app.post('/artists', (req, res, next) => {
    showArtists(req.body.artist, 0, res);
})
app.get('/artists/:artist/:numNext', (req, res, next) => {
    // if(req.params.numNext <= 1) showArtists(req.params.artist, 1, res);
    // else showArtists(req.params.artist, req.params.numNext, res);

    showArtists(req.params.artist, req.params.numNext, res);
})
app.get('/albums/:artistId/:numNext', (req, res, next) => {
    if(req.params.numNext <= 1) showAlbums(req.params.artistId, 1, res);
    else showAlbums(req.params.artistId, req.params.numNext, res);

    // showAlbums(req.params.artistId, req.params.numNext, res);
})
app.get('/albums/:artistId', (req, res, next) => {
    showAlbums(req.params.artistId, 1, res);
})
app.get('/tracks/:albumId', (req, res, next) => {
    showTracks(req.params.albumId, res);
})

app.listen(3000, (req, res, next) => {
    console.log('listening to port 3000...');
});


function authenticate(){
    // Remember to paste here your credentials
    var clientId = '1991c54207d7401c8e2fee441077d0e9',
    clientSecret = '0aeddb395a7f48bba6b6c943ba97575c';

    spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
    });

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('authentication ok');
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });
}

function showArtists(searchArtist, numNext, res){
    spotifyApi.searchArtists(searchArtist, {limit: 21, offset: parseInt(numNext)*21})
    .then(data => {
        const sendData = {
            data: data,
            artist: searchArtist,
            thereIsNext: data.body.artists.next != null ? true : false,
            numNext: parseInt(numNext) + 1
        };
        if(data.body.artists.items.length == 0) res.render('no-results-page', sendData);
        else res.render('artists-results-page', sendData);
    })
    .catch(err => {
      console.log('Error en searchArtists!', err);
      res.render('no-results-page');
    })
}
function showAlbums(artistId, numNext, res){
    console.log('artistId, numNext: ', artistId, ', ', numNext);
    spotifyApi.getArtistAlbums(artistId, {limit: 21, offset: parseInt(numNext)*21})
    .then(data => {
        const sendData = {
            data: data,
            artist: artistId,
            thereIsNext: data.body.next != '' ? true : false,
            numNext: parseInt(numNext) + 1
        };
        console.log('dataaaaaa: ',data);
        if(data.body.items.length == 0) res.render('no-results-page', sendData);
        else res.render('albums-results-page', sendData);
    })
    .catch(err => {
      console.log('Error en getArtistAlbum!', err);
      res.render('no-results-page');
    })
}
function showTracks(albumId, res){
    spotifyApi.getAlbumTracks(albumId, { limit : 50, offset : 0 })
    .then(data => {
        const sendData = {
            data: data,
            thereIsNext: data.body.next != '' ? true : false
        };
        res.render('tracks-results-page', sendData);
    })
    .catch(err => {
        console.log('Error en getAlbumTracks!', err);
    })
}

hbs.registerHelper('anyImage', function(text) {
    return text == undefined ? "/images/default-image.jpg" : text;
});
hbs.registerHelper('thereIsPrev', function(numNext) {
    let isPrev = false;
    if (parseInt(numNext) > 2) isPrev = true;
    console.log('isPrev ', isPrev);
    return isPrev;
});
hbs.registerHelper('numPrev', function(numNext) {
    return parseInt(numNext) - 2;
});

authenticate();
