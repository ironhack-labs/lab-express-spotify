var SpotifyWebApi = require('spotify-web-api-node');
var clientId = 'c73510ef510f4daa8b729949af6198a8';
var clientSecret = '4aca5721590f4effaeef5d0756ff1e4d';

var spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
	.then(function(data) {
		spotifyApi.setAccessToken(data.body['access_token']);
	}, function(err) {
		console.log('Something went wrong when retrieving an access token', err);
	});


const express = require('express')
const app     = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs     = require('hbs');

app.set('view engine', 'hbs');
app.set('views',__dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

//const users = [{name:'Johnny',age:31},{name:'Phocker'}];

app.get('/', function (req,res,next) {
	// const ctx = {users,
	// 			 titulo: 'Johnny Phocker'}

/*	Restaurant.find()
		.then(rs=>{
			res.render('home',{restaurants:rs});
		}).catch(e=>next())  */
	res.render('home'); 

	//res.send('hola');
    //console.log(req)
});

app.get('/artists', (req,res,next)=>{
	res.render('artists');
});

app.post('/artists', function(req,res,next) {

	spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists',{data});
    })
    .catch(e=>next())

	

});




// app.get('/:id',(req,res)=>{
// 	//console.log(req.params);
// 	restaurant.findById(req.params.id).then(restaurant=>{
// 		res.render('detail',restaurant);
// 	});
// });


mongoose.connect('mongodb://localhost:27017/foodPlaces', e=>{
	if(e) {
		console.log('no se pudo conectar', e);
	} else {
		console.log('base de datos conectada');
	}
});



app.get('/',(req,res,next) =>{

	// const hr = new Desayuno({
	// 	name:'Huevitos rancheros',
	// });
	// hr.save()
	// 	.then(r => {
	// 		res.render('home', r);
	// 	})
	// 	.catch(e => next());

	Desayuno.find().then(d=>{
		res.render('home',{d})
	}).catch(e=>next())

	//res.send('hola');
});








app.listen(3000, () => console.log('Example app listening on port 3000!'))




