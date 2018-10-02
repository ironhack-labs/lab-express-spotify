const express = require ("express")
const hbs = require('hbs')
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
 

app.set('view engine', 'hbs')

 app.set('views', path.join(__dirname, 'views'))
 
app.use(bodyParser.urlencoded({extended: true}))
 
 
 const spotify = require('./routes/spotify')


 app.use('/', spotify)
 

app.listen(port) 

const http = require('http');

const server = http.createServer();

server.listen(3000)