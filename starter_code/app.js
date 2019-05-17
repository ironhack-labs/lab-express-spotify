const express = require('express');
const hbs = require('hbs');
const path = require('path')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
hbs.registerPartials(__dirname + '/views/partials')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = 'b7d4ddf407914b9ea9631dff94bc55f7'
const clientSecret = 'dad053f354c74babb9b58eef0909805a'



// instanciando la api
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})
spotifyApi.clientCredentialsGrant()
.then( data => {
  spotifyApi.setAccessToken(data.body['access_token'])
})
.catch( error => {
  console.log("something went wrong when retrieving an access token", error)
})
// routing config

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));


// routin 

app.get('/', (req, res, next)=> {

  res.render('index')
})

app.get('/artists', (req, res, next)=> {
  console.log(req.query.artistQuery)
  spotifyApi.searchArtists(req.query.artistQuery)
    .then(data => {

        //console.log("The received data from the API: ", data.body.artists);
        console.log(data.body.artists.items)
        const artists = data.body.artists.items
        res.render('artists', {artists})
        
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch(err => {
          console.log("The error while searching artists occurred: ", err);
        })
      //res.render('index')
})

app.get('/albums/:id', (req, res, next)=> {
  console.log("HEYYYYYYYYYY", req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
    .then(albums => {

        console.log(albums)
        const artistAlbums = albums.body.items
        console.log(artistAlbums)
        res.render('albums', {artistAlbums})
        
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch(err => {
          console.log("The error while searching artists occurred: ", err);
        })
      //res.render('index')
})

app.get('/songs/:id', (req, res, next)=>{
  console.log("yeii songs", req.params.id)
  spotifyApi.getAlbumTracks(req.params.id)
  .then(songs => {

    console.log(songs)
    const albumSongs = songs.body.items
    console.log(albumSongs)
    res.render('songs', {albumSongs})
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})






// app.get('/albums', (req, res, next)=> {
//   console.log(req.query.artistId)
//   spotifyApi.getArtistAlbums(req.query.artistId)
//     .then(albums => {

//         //console.log("The received data from the API: ", data.body.artists);
//         console.log(albums)
//         const artistAlbums = albums.body.items
//         console.log(artistAlbums)
//         res.render('albums', {artistAlbums})
        
//         // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//       })
//       .catch(err => {
//           console.log("The error while searching artists occurred: ", err);
//         })
//       //res.render('index')
// })



// setting the spotify-api goes here:






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
