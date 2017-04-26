const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.get('/', (request, response, next) => {
    response.render('index');
});

app.get('/artist', (request, response, next) => {

    console.log(request.query.artist);

    spotify.searchArtists(request.query.artist, {}, (err, data) => {
        if (err) throw err;

        let artists = data.body.artists.items;

        console.log(artists);
        // Render after the data from spotify has returned
        response.render('artists', { artists });
    });
});

app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
});
