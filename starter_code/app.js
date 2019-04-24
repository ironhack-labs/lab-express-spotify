const express = require('express');
const hbs = require('hbs');
require('dotenv').config()



    // require spotify-web-api-node package here:
    const SpotifyWebApi = require('spotify-web-api-node');
    
    
    const app = express();
    
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
    
    
    // setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId : process.env.clientId,
    clientSecret : process.env.clientSecret
    });

    spotifyApi.clientCredentialsGrant()
.then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
})
    





// the routes go here:
app.get('/',(req,res,next)=>{
    res.render('index')
})


app.get('/artists', (req,res,next)=>{

    spotifyApi.searchArtists(req.query.artists) //replace this with req.params or req.query 
        .then(data => {
            let items = data.body.artists.items
            res.render('artists', {items})
            console.log("The received data from the API: ", data.body.artists.items);
            //let artists = [ {name:'a'}, {name:'b'}, {name:'c'}]
             // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })


})

app.get('/albums/:identification', (req,res,next)=>{
   spotifyApi.getArtistAlbums(req.params.identification)
   .then(data=>{
        let items = data.body.items
        res.render('albums', {items})
   })
})

app.get('/tracks/:theAlbumsIdPlease', (req,res,next)=>{
    spotifyApi.getAlbumTracks(req.params.theAlbumsIdPlease).then(data=>{
        res.render('tracks', {items:data.body.items})
    })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
