var path = require('path');
var express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://od.moi.gov.tw/',
    changeOrigin: true,
  })
);
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});