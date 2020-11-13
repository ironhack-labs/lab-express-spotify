module.exports = app => {

    app.use('/', require('./base.routs.js'))
    app.use('/artists', require('./artist-search.routs'))
    app.use('/albums', require ('./albums-search.routs'))
}