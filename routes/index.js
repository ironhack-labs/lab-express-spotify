module.exports = app => {

    app.use('/', require('./base.routes.js'))
    app.use('/resultados-busqueda', require('./search.routes.js'))


}