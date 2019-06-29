const fs = require("fs");
const supertest = require('supertest');
const assert = require('assert');

const request = supertest("http://localhost:3010");

function saveResponse(texto, nombreArchivo) {

    fs.writeFile("./test/response/" + nombreArchivo, texto, function (err) {
        if (err) {            return console.log(err);
        }
    });
}

describe('get /api/buscar-artista', function () {
    it('ok request', function (done) {

        request
            .get('/api/buscar-artista/michael%20jackson')
            .expect(200)
            .end(function (err, res) {

                //assert(res.body==='i´m backend :)', "Se espera texto Im backend");

                const c = JSON.parse(res.text);

                saveResponse(res.text, 'buscar-artista.json');

                assert(c.texto === "michael jackson", "no es el texto buscado");

                if (err) return done(err);
                done();
            })
        ;

    });

})
;

