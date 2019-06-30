const fs = require("fs");
const supertest = require('supertest');
const assert = require('assert');

const request = supertest("http://localhost:3010");

function saveResponse(texto, nombreArchivo) {

    fs.writeFile("./test/response/" + nombreArchivo, texto, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

describe('get /api/buscar-artista', function () {
    it('ok request', function (done) {

        request
            .get('/api/buscar-artista/michael%20jackson')
            .expect(200)
            .end(function (err, res) {


                saveResponse(res.text, 'buscar-artista.json');

                const c = JSON.parse(res.text);

                assert(c.success, "Se esperada true como tipo de succes");
                assert(c.msg === "", "No deberiamos tener un mensaje de en la respuesta");

                assert(typeof c.data === "object", "El objeto data deberia deberia ser un objeto");

                let dataRespuesta = c.data;

                assert(dataRespuesta.texto === "michael jackson", "no es el texto buscado");

                assert(dataRespuesta.next === "http://localhost:3010/api/buscar-artista/michael jackson/2", "next incorrecto");

                assert(dataRespuesta.total > 0, "items totales  incorrectos");

                assert(typeof dataRespuesta.items === "object", "se esperaba un tipo objecto");

                assert(dataRespuesta.items.length > 0, "items totales  incorrectos");

                if (err) return done(err);
                done();
            })
        ;

    });

})
;

