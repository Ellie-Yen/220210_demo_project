const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const app = express();

const API_SERVICE_URL = 'https://od.moi.gov.tw/';

const onProxyRes = (async (buffer, proxyRes, req, res) => {
  console.log(buffer, proxyRes, req, res);
  // log original request and proxied request info
  const exchange = `[DEBUG] ${req.method} ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} [${proxyRes.statusCode}]`;
  console.log(exchange);

  // log original response
  console.log(`[DEBUG] original response:\n${buffer.toString('utf8')}`);

  // set response content-type
  res.setHeader('content-type', 'application/json; charset=utf-8');

  // set response status code
  res.statusCode = 200;

  // return a complete different response
  return JSON.stringify({
    message: 'test'
  });
});

app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  headers: {
    connection: 'keep-alive'
  },
  logLevel: 'debug',
  onProxyRes
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});