const SpotifyWebApi = require("spotify-web-api-node");
const express = require('express');
const hbs = require('hbs');

const app = express();

const clientId = "9b2f2eda8a824a01a67f3bd272d1191d",
  clientSecret = "f2092c65231444e799c1547220186feb";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);
