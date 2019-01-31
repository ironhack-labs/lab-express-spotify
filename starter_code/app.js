const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '2db8407930974a04b0fcd98d33168452',
    clientSecret = 'd01b832ca2fc45d38abd7d458e44a096';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});





spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// setting the spotify-api goes here:

app.get('/',(req,res,next)=> res.render('index'))

app.get('/artists',(req,res,next)=> 
{
        
    spotifyApi.searchArtists(req.query.search)
    .then(data => 
    { const cosita=data.body.artists.items
        console.log("The received data from the API: ", data.body.artists.items);
        console.log(cosita)
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artists',{cosita})
    })
    .catch(err => 
    {
      console.log("The error while searching artists occurred: ", err);
    })
    

})

app.get('/albums/:artistId',(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then (data=>
  { const cosota=data.body.items
    console.log (cosota)
    res.render('albums',{cosota})
  })
  .catch(err => 
    {
      console.log("The error while searching artists occurred: ", err);
    }
  )
})

// app.get('/tracks',(req,res,next)=>{
// spotifyApi.getAlbumTracks()(req.params.artistTrack)
// .then(data=>
//   {console.log(data)
// })
// .catch(err=>{
//   console.log("The problem is", err)
// })










// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
