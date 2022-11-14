require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) => res.render('index'));

// Our routes go here:
app.get('/artist-search', (req, res) => {
    const { artist } = req.query;

    spotifyApi.searchArtists(artist, { limit: 6 })
    .then(data => {
        // console.log('The received data from the API: ', data.body.artists.items[0]);
        let importData = data.body.artists.items;
        res.render('artist-search-results', {artist: importData})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    const id = req.params.artistId; 

    spotifyApi.getArtistAlbums(id, { limit: 3 })
        .then( data => {
            // console.log('Artist albums', data.body);
            let importAlbums = data.body.items;
            // console.log('DATA TO IMPORT', importAlbums);
            res.render('albums', {albums: importAlbums})

        })
        .catch( err => console.log('Error while Artis albumb',err))
})

app.get('/tracks/:trackId', (req, res) => {
    const trackId = req.params.trackId;

    spotifyApi.getAlbumTracks(trackId, { limit : 5, offset : 1 })
        .then( data => {
            let importTracks = data.body.items;
            importTracks.forEach(elem=>{
                console.log("ELEM",elem.external_urls)
            })
            // console.log("EXTERNAL",importTracks.external_urls);
            res.render('tracks', { tracks: importTracks } )
        })
        .catch( err => console.log("Error retrieving tracks", err) )
})






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
