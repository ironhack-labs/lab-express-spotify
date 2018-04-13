const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");
hbs.registerPartials(__dirname + '/views/partials');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '546d7bf884a9465897fa555f51734e97',
    clientSecret = 'b1e352ec4fba4ed28a4e5915a398f9f9';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// var artistName;
// var albumName;

//Routes
//-------------------------------------------------------------------------------------------

app.get("/", (req, res, next) => {
    res.render("home-page");
});

app.get("/artists", (req, res, next) => {

    spotifyApi.searchArtists(req.query.artist)
    .then( (data) => {
        // console.log(data.body.artists.items);
        // console.log(data.body.artists.items[3].images[1]);
        // console.log(data.body.artists.items.images);

        // let artists = data.body.artists.items;
        // res.render("artists", { artists });
        res.locals.artistsQuery = req.query.artist;
        res.locals.artists = data.body.artists.items;
        res.render("artists");
    })
    .catch( (err) => {
        console.log("ERROR, spotify artist query failed", err);
    })
});

app.get("/albums/:artistId/:artistName", (req, res, next) => {

    spotifyApi.getArtistAlbums(req.params.artistId)
    .then( (data) => {
        // console.log(data.body.items[0].images);
        // console.log(data.body);
        res.locals.artist = req.params.artistName;
        res.locals.artistAlbums = data.body.items;
        res.render("albums");
    })
    .catch( (err) => {
        console.log("ERROR, spotify album query failed", err);
    });
});

app.get("/tracks/:albumId/:albumName", (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then( (data) => {
        console.log(data.body);
        // var artistData = {
        //     album : req.params.albumName,
        //     albumTracks : data.body.items
        // }

        res.locals.album = req.params.albumName;
        res.locals.albumTracks = data.body.items;
        // res.render("tracks",{artistData} );
        res.render("tracks");
    } )
    .catch( (err) => {
        console.log("ERROR, spotify tracks query failed", err);
    });
});


//-------------------------------------------------------------------------------------------

app.listen(8080, () => {
    console.log("Spotify App is running :)");
});