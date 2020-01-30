require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser");
const app = express();
const api = require('./config/spotify.config')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Our routes go here:
app
    .get('/', (req, res, next) => {
        res.render('index')
        })
    .post('/artist-search', (req , res) => {
        const artist = req.body.artist
        api.searchArtists(artist)
            .then( artistSearch =>{
                res.render('artist-search', {artistSearch})
            })
            .catch( err => console.log(err))
        
    })
    .get('/albums/:artistId', (req, res, next) => {
        const { artistId } = req.params
        api.getArtistAlbums(artistId)
            .then( album => {
                console.log(album.body.items)
                res.render('albums', {album})
            })
            .catch(err => console.log(err))
    })
    .get('/tracks/:albumId', (req, res, next) => {
        const {albumId} = req.params
        api.getAlbumTracks(albumId)
            .then( track => {
                console.log(track.body.items)
                res.render('tracks', {track})
            })
            .catch(err => console.log(err))
    })




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
