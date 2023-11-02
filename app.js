require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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


app.get('/', (req, res)=>{
    res.render('home-page')
})


app.get('/artist-search',(req,res)=>{

    const artist = req.query
    
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(data.body.artists.items)
            res.render('artist-search-results', {artists: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
        

})

app.get('/albums/:id', (req, res)=>{
    const id = req.params
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(dataElm => {
            // console.log('The received data from the API: ', dataElm.body)
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(dataElm.body.items)
            res.render('album', { albums: dataElm.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
        
    
})

app.get('/songs/:id', (req, res) => {
    const id = req.params
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(dataElement => {
            // console.log('The received data from the API: ', dataElm.body)
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(dataElement.body.items)
            res.render('songs', { songs: dataElement.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))


})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
