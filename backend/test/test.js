const supertest = require('supertest');
const assert = require('assert');

const request = supertest("http://localhost:3010");


describe('get /api/buscar-artista', function () {
   it('ok request', function (done) {

      request
          .get('/api/buscar-artista/michael%20jackson')
          .expect(200)
          .end(function (err, res) {

             //assert(res.body==='i´m backend :)', "Se espera texto Im backend");

             const c = JSON.parse(res.text);

             console.log(c);
             assert(c.texto === "michael jackson", "no es el texto buscado");

             console.log(res.text);
             if (err) return done(err);
             done();
          })
      ;

   });
})
;

