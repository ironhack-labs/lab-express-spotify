const supertest = require('supertest');
const assert = require('assert');

const request = supertest("http://localhost:3010");


describe('get /', function () {
   it('backend escuchando puerto', function (done) {

      request
          .get('/')
          .expect(200)
          .end(function (err, res) {

             assert(res.text==='i´m backend :)', "Se espera texto Im backend");

             console.log(res.text);
             if (err) return done(err);
             done();
          })
      ;

   });
})
;

