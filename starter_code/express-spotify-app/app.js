'use strict';

const expressLayout = require('express-ejs-layouts');
const bodParser = require('body-parser');
const morgan = require('morgan');
const prettyJson = require('prettyjson');
const express = require('express');
const app = express();



const SpotifyWebApi = require('spotify-web-api-node');


app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
// Remember to paste here your credentials
var clientId = '32dad615e2ae4c0b93a8f4643efd8bfa',
    clientSecret = 'e472a1c3b376457582e0a3341cc16783';

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



app.get('/home', (req, res) => {
    res.render('index');
});


app.post('/artists', (req, res) => {
    let search = req.body.search
    spotifyApi.searchArtists(artistSearched)
    .then((data) => {
        res.render('artists', {data:body.search.items});
    }, function(err) {
        console.error(err);
    });
});

app.get('/home', (req, res) => {
    res.render('index');
 });
 
//  app.post('/artist', (req, res, next) => {
//     let search = req.body.search
//     spotifyApi.searchArtists(search)
//         .then((data) => {
//         res.render('artist', {data: body.artist.items});
//         }, function (err) {
//             console.error(err);
//         });
//  });



app.listen(3030, () => {
    console.log('My first app listening on port 3030!')
});