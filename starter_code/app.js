
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'da78ce8fcb0047d8bc7814eeb36e4575',
    clientSecret = 'd11db6db618a47bdae76f64531554ec0';

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

// the routes go here:
app.get('/', (req, res, next) =>{
    res.render("homePage")
})

app.get('/artists', (req, res, next) => {
  //  console.log("The Artist is: ", req.query)
    spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
           // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { theArtist: data.body.artists.items })
   //  console.log("The received data from the API: ", data.body.artists.items);
   //  console.log("The Artist ID is ", data.body.artists.items[0].id);
      //console.log("Name of artists: ", data.body.artists.items[0].name); //GET THE ARTIST NAME
    //  console.log("Image url of artists: ", data.body.artists.items[0].images[0].url); //GET THE ARTIST IMAGE URL
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('albums', { theAlbum: data.body.items, theArtistName: data.body.items[0].artists[0].name} )
  // console.log("The info received was NAME: ", data.body.items[0].artists[0].name);
  // console.log("The Album ID is: ", data.body.items[0].id);
  })
  .catch(err => console.log("The error while searching albums occurred: ", err))
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    res.render('tracks', { theTracks: data.body.items} )
 //  console.log("The info received was: ", data.body.items[0]);
 //  console.log("The Album ID is: ", data.body.items[0].id);
  })
  .catch(err => console.log("The error while searching albums occurred: ", err))
})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
