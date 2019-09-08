const SpotifyWebApi = require('spotify-web-api-node'); // getting spotify API
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const clientId = '9cda1a47a5954ca69bdeb84975979014',
    clientSecret = '1f9829eeb1b44fdda412f59b1fb6470c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  // uporer ta copied from the spotify package and giving my id and credentials


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


// setting the spotify-api goes here:


// the routes go here:
app.get("/", (req, res) => { 
    res.render("index.hbs");
});

// working in the searching part
app.get("/artist", (req, res) => { 
    
    let artist = req.query.search /// creating a variable to search in the database
    spotifyApi.searchArtists(artist)  // searching the variable we declared
    .then(data => {     // a promise
        console.log("The received data from the API: ", data.body.artists.items[0]);
        res.render("artist.hbs", data);  // render the artist page in searching
        // let artist = data.body.artists.items; /// artist search krle body, artist,item shob jno ashe
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});


app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albums => {
      console.log('Artist albums', albums.body);
      res.render('albums,hbs', albums.body);
    })
    .catch(error => {
      console.error('Error loading Album');
    });
});
  
  
  



app.listen(3005, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
