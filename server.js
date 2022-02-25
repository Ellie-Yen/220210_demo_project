const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const app = express();

const API_SERVICE_URL = 'https://od.moi.gov.tw/';

app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true
}));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});