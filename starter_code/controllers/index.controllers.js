require('dotenv').config()
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

exports.landing = (req, res) => {
    res.render('home')
};

exports.artist = (req, res) => {
    const { artist } = req.query;
    spotifyApi.searchArtists(artist)
    .then(response => {
        res.render('artists', { response })
    })
}

exports.album = (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(albums => {
        res.render('albums', {albums})
    })
}

exports.tracks = (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(tracks => {
        console.log(tracks.body.items)
        res.render('tracks', {tracks})
    })
}