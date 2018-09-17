const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require("spotify-web-api-node");

var clientId = "8f666642d32f48369f268b22fbe7fd56",
    clientSecret = "e3871fd2a82d493b9c2f49c2f1062088";

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
        console.log("Something went wrong when retrieving an access token", err);
    }
);