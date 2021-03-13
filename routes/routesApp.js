const express = require('express');

const app = express();

const SpotifyController = require('../controller/Spotify.controller');

const spotify = new SpotifyController();

app.get('/artist-search', async (req, res) => await spotify.searchArtists(req, res));

app.get('/albums/:artistId', async (req, res) => await spotify.getArtistAlbums(req, res));

app.get('/tracks/:trackId', async (req, res) => await spotify.getAlbumTracks(req, res));

module.exports = app;