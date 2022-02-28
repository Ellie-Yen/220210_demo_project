const express = require('express');
const path = require('path');
const apiRouter = require('./backend/router/api');
const app = express();

/*
this only works locally bc restrictions in free cloud hosting service.

const { createProxyMiddleware } = require('http-proxy-middleware');
const API_SERVICE_URL = 'https://od.moi.gov.tw/';

app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  headers: {
    connection: 'keep-alive'
  },
  logLevel: 'debug'
}));
*/

app.get('/api/**', apiRouter);
app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});