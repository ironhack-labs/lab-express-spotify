const express = require('express');
const hbs = require('hbs');
const app = express();
require('dotenv').config()

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

console.log(process.env.clientId)

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here


const spotifyApi = new SpotifyWebApi({
    clientId: 'e444fad7ca40424989ec62fab7af2ca6',
    clientSecret: 'f3dc836a6fc34fae8a713d61a19c840b'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        console.log('success')
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })


app.get('/', (elephants, bunnies, _)=>{
    bunnies.render('index')
})





//http://localhost:3000/searchArtist?nameOfArtist=madonna
app.get('/searchArtist', (req,res,next)=>{
    spotifyApi.searchArtists(req.query.nameOfArtist)
    .then(data=> {
        console.log('dta from spotify', data.body.artists.items)
        res.render('artists', {items: data.body.artists.items} )
        //res.json(data.body.artists.items) //makes looking at data easier sometimes
    }).catch(err=>console.error(err))
})





//http://localhost:3000/albums/2QsynagSdAqZj3U9HgDzjD
app.get('/albums/:identification', (req,res,next)=>{
    spotifyApi.getArtistAlbums(req.params.identification).then(data=>{
        let items = data.body.items
        res.render('albums', { items })
        //res.json(data)
    })

})

//http://localhost:3000/tracks/2qmmPaaWXRM1kZujpUKKsO
app.get('/tracks/:theAlbumsIdPlease', (req, res, next)=> {
    spotifyApi.getAlbumTracks(req.params.theAlbumsIdPlease).then(data=>{
        //res.json(data.body.items)
        res.render('tracks', { items:data.body.items })
    })
})





// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));