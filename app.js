var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.status(200);
    res.send('<html><body><h1>Welcome to the landing page!</h1></body></html>');
});

app.get('/products', function (req, res) {
    res.send('<html><body><h1>Browse our many wonderful products.</h1></body></html>');
});

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

const port = 8080;
app.listen(port, function () {
    console.log(`Server is listening on port ${port}`);
});
