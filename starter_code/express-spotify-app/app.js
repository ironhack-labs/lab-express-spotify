//-------------------------Requirements and Constants-------------------------//
////////////////////////////////////////////////////////////////////////////////
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const app             = express();
const expressLayouts  = require('express-ejs-layouts');

//---------------------If this doesn't log, it ain't working------------------//
////////////////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
  console.log('My first app listening on port 3000!!!!!')
});

//------------------------------Use and Sets----------------------------------//
////////////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

//-----------------------------DONT TOUCH BELOW-------------------------------//
////////////////////////////////////////////////////////////////////////////////
// spotify.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists)
// });

//-----------------------Get Requests and Functions---------------------------//
////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
   let artistName = req.query.artist;

  spotify.searchArtists(artistName, {}, (err, data) => {
    if (err) throw err;
    let artist = data.body.artists.items;//-------------------------------------------artist array

    let image = artist.forEach((album)=>{
          // album.images.forEach((image)=>{
            console.log(album.images[0]);
          // })
    });

    //  console.log(artist[2].name);


    let artistData = {artistName: req.query.artist,
                      artist: artist};
    res.render('artists', artistData);//----------------------------------------------rendering
  });
});
