const expressWinston = require('express-winston');
const winston = require('winston');
const express = require('express');
const config = require('config');
const apm = require('@elastic/apm-rum')
const app = express();

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    meta: true,
    expressFormat: true
}));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

const port = config.get('server.port');
const apmHost = config.get('apm.host');
const apmPort = config.get('apm.port');
const rootMinTime = config.get('paths.root.minWaitTimeMs');
const rootMaxTime = config.get('paths.root.maxWaitTimeMs');
const productsMinTime = config.get('paths.products.minWaitTimeMs');
const productsMaxTime = config.get('paths.products.maxWaitTimeMs');
const productsErrorChance = config.get('paths.products.errorChance');
const aboutMinTime = config.get('paths.about.minWaitTimeMs');
const aboutMaxTime = config.get('paths.about.maxWaitTimeMs');
const loginMinTime = config.get('paths.login.minWaitTimeMs');
const loginMaxTime = config.get('paths.login.maxWaitTimeMs');
const healthMinTime = config.get('paths.health.minWaitTimeMs');
const healthMaxTime = config.get('paths.health.maxWaitTimeMs');
const healthErrorChance = config.get('paths.health.errorChance');
const notfoundMinTime = config.get('paths.notfound.minWaitTimeMs');
const notfoundMaxTime = config.get('paths.notfound.maxWaitTimeMs');

apm.init({
  serviceName: 'GeneralStore',
  serverUrl: `http://${apmHost}:${apmPort}`,
  serviceVersion: '1.0.1'
})

app.get('/', async function (req, res) {
    await sleep(getRandomInt(rootMinTime, rootMaxTime));
    res.status(200);
    res.send('<html><body><h1>Welcome to the Old General Store!</h1></body></html>');
});

app.get('/products', async function (req, res) {
    await sleep(getRandomInt(productsMinTime, productsMaxTime));
    if (Math.random() <= productsErrorChance) {
        res.status(500);
        console.log('Unable to list products.');
        res.send('<html><body><h1>Somethin\' happened, pardner!</h1></body></html>');
    } else {
        res.send('<html><body><h1>Browse our shelves, pardner!</h1></body></html>');
    }
});

app.get('/about', async function (req, res) {
    await sleep(getRandomInt(aboutMinTime, aboutMaxTime));
    res.send('<html><body><h1>Our company has been around for awhile, and it\'ll be here \'til the cows come home.</h1></body></html>');
});

app.get('/login', async function (req, res) {
    await sleep(getRandomInt(loginMinTime, loginMaxTime));
    res.send('<html><body><h1>Log in or log on, the choice is yours, buckaroo!</h1></body></html>');
});

app.get('/health', async function (req, res) {
    await sleep(getRandomInt(healthMinTime, healthMaxTime));
    if (Math.random() <= healthErrorChance) {
        res.status(500);
        console.log('Health status: bad.');
        res.send('<html><body><h1>There\'s a snake in my boot!</h1></body></html>');
    } else {
        res.send('OK!');
    }
});

app.use(async function(req, res, next) {
    await sleep(getRandomInt(notfoundMinTime, notfoundMaxTime));
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(port, function () {
    console.log(`Server is listening on port ${port}`);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
