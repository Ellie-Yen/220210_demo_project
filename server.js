const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const app = express();

const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes('/api')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

const API_SERVICE_URL = 'https://od.moi.gov.tw/';
app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  secure: false,
  headers: {
    connection: 'keep-alive'
  }
}));
app.use(extendTimeoutMiddleware);
app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});