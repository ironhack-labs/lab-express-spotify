var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = '801664646e384b4dbf99835556546212',
    clientSecret = 'e4ab26ed56b042afa3f70c169a485fc1';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


app.get('/', (req, res, next)=>{
    res.render('home')
})



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});





app.get('/artists', (req,res,next)=>{
    
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artists', {search: data.body.artists.items})
        console.log(data)
        // console.log(search)
    })
    .catch(err => { 
        // ----> 'HERE WE CAPTURE THE ERROR'
        console.log(err)
    })
    
})


app.get('/albums', (req, res, next)=>{
    res.render('albums')
})




app.listen(3000, () => console.log('Example app listening on port 3000!'))
