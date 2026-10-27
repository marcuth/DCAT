const express = require('express');
const { frontendDir, publicDir } = require('./config');
const routes = require('./routes');

const app = express();

app.use(express.json({ limit: '40mb' }));
app.use('/', express.static(frontendDir));
app.use(express.static(publicDir));
app.use(routes);

module.exports = app;
