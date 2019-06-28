'use strict';

/**
 * Created by David on 27/06/2019. *
 *
 */

const express = require('express');

const app = express();

app.use(express.static('public'));


app.get("/debug", function (req, res) {
    res.send('yea baby');
});

const port = 4001;
app.listen(port, () => console.log(`static server running on port ${port}!`));