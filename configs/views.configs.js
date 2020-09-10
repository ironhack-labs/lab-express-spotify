const favicon = require('serve-favicon')
const path = require('path')
const express = require('express')
const hbs = require('hbs')

module.exports = app => {
    app.set('views', path.join(__dirname, '..', 'views'))
    app.set('view engine', 'hbs')
    app.use(express.static(path.join(__dirname, '..', 'public')))
    app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')))

    hbs.registerPartials(path.join(__dirname, "..", "/views", "partials"))     // Registro de parciales
}