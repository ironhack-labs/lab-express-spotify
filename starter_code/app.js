const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '98e47bdfe226412991729662c2fb1507',
    clientSecret = '7fbd98e809884b2fb19509d18588c5ed';

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

// the routes go here:

app.get('/', (req, res, next)=>{
  res.render('index')
});


app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
      .then(data => {
  
        console.log("The received data from the API: ", data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
  res.send(req.query)
})



// app.get('/books/:bookId', (req, res, next) => {
//   res.send(req.params);
// })


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
