var assert = require('assert');


describe('GET /tasks', function() {
   it('returns a list of tasks', function(done) {
      request.get('/tasks')
          .expect(200)
          .end(function(err, res) {
             expect(res.body).to.have.lengthOf(2);
             done(err);
          });
   });
});
