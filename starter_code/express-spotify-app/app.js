const express = require('express');
const app = express();
const hbs = require('hbs');
const axios = require('axios');
var path = require('path');
var logger = require('morgan');
var querystring = require('querystring');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var artists = require('./routes/artists');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '76b4a86e15164152a814537e6686ac8a',
	clientSecret = '77c90b49c1b644b3a84d6fa3af7de6eb';

var spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

// Retrieve an access token.

spotifyApi.clientCredentialsGrant()
	.then(function (data) {
		spotifyApi.setAccessToken(data.body['access_token']);
		token = data.body['access_token'];
	}, function (err) {
		console.log('We could not find the access token ;(', err);
	});

//app.use('/', index);

app.get('/', function (req, res, next) {
	res.redirect("/index?" + querystring.stringify({
		access_token: token
	}));
});

app.get('/index', function (req, res, next) {
	res.render("index")
});

app.get('/artists', (req, res) => {
	spotifyApi.searchArtists(req.query.artist)
		.then(data => {
			res.render('artist', {
				artists: data.body.artists.items
			})
		})
		.catch(err => {
			console.log("Something went wrong!", err)
		})
})

app.get('/albums/:artistId', (req, res) => {
	spotifyApi.getArtistAlbums(req.params.artistId)
		.then(data => {
			res.render('albums', {
				albums: data.body.items
			})
		})
		.catch(err => {
			console.log('Something went wrong... ', err)
		})
});

app.get('/tracks/:albumId', (req, res) => {
spotifyApi.getAlbum(req.params.albumId,
  function(err, data) {
    if (err) {
      console.error('Something went wrong!');
    } else {
		var albumname = data.body.name; 	
		spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {            
            tracks = data.body.items;
			console.log("laatste kans: ") + albumname;		
			debugger
			res.render('tracks', { tracks: tracks, albumname: albumname })           
        })
        .catch(err => {
            console.log('Someting went wrong! ${err}')
        })
    }	
  } 
)  
});

app.listen(3000);
