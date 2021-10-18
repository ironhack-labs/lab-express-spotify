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

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/artist-search', (req, res) => {

    spotifyApi
        .searchArtists(req.query.artistName)   //
        .then((data) => {
            console.log(".........")
            // console.log(data.body)
            console.log(data.body.artists.items[0])
            // console.log('The received data from the API: ', data.body);
            console.log(".........")
            // res.send(`Displaying a list wit all artists from ${req.query.artistName}`)
            console.log(data.body.artists.items)
            // const artistList = [href, items]    ///keep console logging to see what i needzx\
            res.render('artist-search-results', data.body.artists.items)
            // res.render('artist-search-result', req.query.artistName)
            // res.render('artist-search-result', data.body.artists)
        })
       
            
})

app.get('/albums/:artistId', (req, res, next) => {
const artistId =  req.params.artistId;
const namesAlbum = [];
console.log("id "+artistId)
    spotifyApi.getArtistAlbums(artistId)
            .then((data) => {
                //console.log(req.query)
                data.body.items.forEach( Element => {
                    namesAlbum.push(Element.name);
                })

                //console.log(namesAlbum);
                    
                
                
                //data.body.items.name
                var namesAlbumunique = namesAlbum.filter((v, i, a) => a.indexOf(v) === i);
                //console.log('Artist albums', data.body.items[0].artists);
                res.render('albums',{ data: data.body.items , artists: data.body.items[0].artists })  //
                  //console.log('Artist albums', data.body);
                  //console.log('Artist albums', data.body.items[0].artists[0].id);
                  


                  console.log('Artist albums', namesAlbumunique);
                    // .getArtistAlbums() code goes here
                  });
                })
        
       // .catch(err => console.log('The error while searching artists occurred: ', err));








app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
