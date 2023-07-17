require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//setting the spotify-api goes here:
app.get('/', (rq, rs, next) => {
    rs.redirect('/home')
})

// Our routes go here:
app.get('/home', (rq, rs) => {
    try {
        rs.render('homepage')
    }
    catch (err) {console.log(err)}
})

app.get('/artist-search', (rq,rs) => {
    spotifyApi.searchArtists(rq.query.artist)
    .then(data => {
        // console.log('The received data from the API: ', data.body.artists.items[0]);
        const image = data.body.artists.items[0].images[0].url
        const {name, id} = data.body.artists.items[0]
        rs.render('artist-search-results', {name, id, image})
    })
    .catch(err => console.log(err))
})

app.get('/albums/:id', (rq,rs) => {
    spotifyApi.getArtistAlbums(rq.params.id)
    .then(data => {
        let images = []
        data.body.items.forEach(item => images.push(item.images[0].url))
        let names = []
        data.body.items.forEach(item => names.push(item.name))
        let ids = []
        data.body.items.forEach(item => ids.push(item.id))
        let myAlbums = []
        for(let i=0; i<names.length; i++) {
            myAlbums.push({name: names[i], id: ids[i], image: images[i]})
        }
        rs.render('albums', {myAlbums})
    })
})

app.get('/tracks/:id', (rq,rs) => {
    spotifyApi.getAlbumTracks(rq.params.id)
    .then(data => {
        const myTracks = data.body.items
        console.log(myTracks)
        rs.render('tracks', {myTracks})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
