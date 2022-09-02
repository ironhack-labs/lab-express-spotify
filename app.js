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


// Our routes go here:

// just redering homepage for now
app.get('/', (req,res) => {
    res.render('index')
})

// Route for the search query
// address is of type http://localhost:3001/artist-search?artist=asd

app.get('/artist-search', (req,res) => {
    const searchedArtist = req.query.artist
    // access the request query - "?artist", and the key is "artist" as set in the button's name parameter in index.hbs 
    spotifyApi
    .searchArtists(searchedArtist, {limit:9})
    .then(data => {
        // res.json(data) // RESPONDS WITH THE OBJECT JSONIFIED SO YOU CAN EXPLORE IT EASILY
        const albumsArray = data.body.artists.items;
        res.render('artist-search-results', {
            doctitle: `Search results for ${searchedArtist}`,
            albumsArray
        })
    })
    .catch(err => {
        console.log('Error while searching for artists occured:' + err)
    })
})

// route for showing albums of a selected artistId
app.get('/albums/:artistID', (req,res) => {
    const clickedArtist = req.params.artistID
    spotifyApi.getArtistAlbums(clickedArtist,{limit:9})
    .then(data => {
        const listOfAlbums = data.body.items
        res.render('albums', {
            doctitle: "Albums",
            listOfAlbums
        })
    })
    .catch(err => {
        console.log('Error fetching albums:' + err)
    })
})

// route for showing tracks of an album
// http://localhost:3001/6emgUTDksZyhhWmtjM9FCs/tracks

app.get('/:albumID/tracks', (req,res) => {
    const clickedAlbum = req.params.albumID;
    spotifyApi
    .getAlbum(clickedAlbum)
    .then(data => {
        //console.log(data.body.tracks.items)
        const tracksIDS = data.body.tracks.items.map(trackObj => trackObj.id)
        return tracksIDS
    })
    .then(tracksIds => {
        console.log(tracksIds)
        return spotifyApi.getTracks(tracksIds)
    })
    .then(tracks => {
        const tracksArr = tracks.body.tracks;
        res.render('tracks', {
            doctitle : 'Tracks',
            tracksArr
        })
    })
    // .then(tracks => {
    //     return tracksPreviewURLs = tracks.body.tracks.map(trackObj => trackObj.preview_url)
    // })
    // .then(preview_url => {
    //     res.send(preview_url)
    // })
    // .then(tracks => {
    //     return spotifyApi.getTracks(tracks)
    // })
    // .then(returnedTracks => {
    //     console.log(returnedTracks)
    // })
})






// START SERVER!!!
app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
