const fs = require("fs");
const supertest = require('supertest');
const assert = require('assert');


function saveResponse(texto, nombreArchivo) {

   fs.writeFile("./test/response/" + nombreArchivo, texto, function (err) {
      if (err) {
         return console.log(err);
      }
   });
}


const request = supertest("http://localhost:3001");


describe('get /api/artist-albums', function () {
   it('ok request', function (done) {

      request
          .get('/api/artist-albums/3fMbdgg4jU18AjLCKBhRSm')
          .expect(200)
          .end(function (err, res) {

             saveResponse(  JSON.stringify(res), 'artist-albums_fullres.json');

             const c = JSON.parse(res.text);

             saveResponse(res.text, 'artist-albums.json');

             assert(c.success, "Se esperada true como tipo de succes");
             assert(c.msg === "", "No deberiamos tener un mensaje de en la respuesta");

             assert(typeof c.data === "object", "El objeto data deberia deberia ser un objeto");

             let dataRespuesta = c.data;

             assert(dataRespuesta.idArtista === "3fMbdgg4jU18AjLCKBhRSm");
             assert(dataRespuesta.next === "http://localhost:3010/api/artist-albums/3fMbdgg4jU18AjLCKBhRSm/2", "next incorrecto");

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

