require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const getAndSetSpotifyToken = async () => {
    try {
        const { body: { access_token } } = await spotifyApi.clientCredentialsGrant()
        spotifyApi.setAccessToken(access_token)
        return console.log('Access token successfully')
    } catch (error) {
        return console.log('Access token failed: ' + error)
    }
}

const handlerSearchArtists = async (artist) => {
    try {
        const { body: result } = await spotifyApi.searchArtists(artist)
        return result
    } catch (error) {
        return console.log('Access token failed: ' + error)
    }
}

const handlerGetAlbums = async (id) => {
    try {
        const { body: result } = await spotifyApi.getArtistAlbums(id)
        return result
    } catch (error) {
        return console.log('Error during album fetch' + error)
    }
}
const handlerGetTracks = async (id) => {
    try {
        const { body: result } = await spotifyApi.getAlbumTracks(id)
        return result
    } catch (error) {
        return console.log('Error during album fetch' + error)
    }
}

// Get and Set Token 
getAndSetSpotifyToken()

// index router
app.get('/', async (req, res) => {
    return res.render('index');
})
// search router
app.get('/search', async (req, res) => {
    const { search } = req.query
    const { artists } = await handlerSearchArtists(search)
    if (artists.items.length < 1) {

        return res.send({ error: 'Artist not found.' });
    }
    return res.render('listOfArtists', { artists: artists.items })
})
app.get('/albuns/:id', async (req, res) => {
    const { id } = req.params
    const albums = await handlerGetAlbums(id)
    return res.render('listOfAlbums', albums.items);
})
app.get('/album/:id', async (req, res) => {
    const { id } = req.params
    const tracks = await handlerGetTracks(id)
    // return res.send(tracks.items);
    return res.render('tracks', tracks.items);
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
