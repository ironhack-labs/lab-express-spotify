const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (request, response) => {
    response.render('home');
});

app.get('/artist-search', async (request, response) => {
    const { artistName } = request.query;

    try {
        const { body: {artists: { items } } } = await spotifyApi.searchArtists(artistName);

        response.render('artist-search-results', { items })
    } catch (error) {
        console.log(error);
    }
});

app.get('/albums/:artistId', async (request, response) => {
    const { artistId } = request.params;
    
    try {
        const { body: { items }} = await spotifyApi.getArtistAlbums(artistId);

        response.render('albums', { items });
    } catch (error) {
        console.log(error);
    }
});

app.get('/tracks/:trackId', async (request, response) => {
    const { trackId } = request.params;
    
    try {
        const { body: { items }} = await spotifyApi.getAlbumTracks(trackId);

        response.render('tracks', { items });
    } catch (error) {
        console.log(error);
    }
});

module.exports = app