require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => res.render("index"))
app.get("/artist-search-result", (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {

            const artists = data.body.artists.items.map(artist => {
                const artistObject = {
                    name: artist.name,
                    id: artist.id,
                }
                if (artist.images.length >= 1) {
                    artistObject.imageUrl = artist.images[0].url
                } else artistObject.imageUrl = "https://static.wikia.nocookie.net/spongebob/images/c/cc/Artist_Unknown_title_card.png"
                return artistObject
            })
            return artists
        })
        .then(artists => res.render("artist-search-result", { artists }))
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId/:artistName", (req, res) => {

    const { artistId, artistName } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(albums => {
            const artistAlbums = albums.body.items.map(album => {
                const artistAlbum = {
                    name: album.name,
                    id: album.id,
                }
                if (album.images.length) {
                    artistAlbum.imageUrl = album.images[0].url
                } else artistAlbum.imageUrl = "https://static.wikia.nocookie.net/spongebob/images/c/cc/Artist_Unknown_title_card.png"
                return artistAlbum
            })
            res.render("albums", { artistAlbums, artistName })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));

})

app.get("/tracks/:albumId/:albumName", (req, res) => {
    const { albumId, albumName } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(tracks => {
            const albumTracks = tracks.body.items.map(album => {
                const albumTrack = {
                    name: album.name,
                    id: album.id,
                    previewUrl: album.preview_url,
                }
                return albumTrack
            })
            return albumTracks
        })
        .then(tracks => res.render("tracks", { tracks, albumName }))

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
