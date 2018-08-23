const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (req,res,next) => {
  res.render('home')
})


app.listen(3000, () => {
  console.log("Server listening on port 3000");
})