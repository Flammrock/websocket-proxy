const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const wsProxy = createProxyMiddleware('ws://echo.websocket.events', {
  changeOrigin: true,
  onProxyReqWs: (proxyReq, req, socket) => {
    socket.on('error', err => console.log(err));
  },
  ws: true,
  router: (req) => {
    return req.url.substring(1);
  }
});

const app = express();
app.use((req, res, next) => {
  req.originalUrl = req.path;
  next();
});
app.use(wsProxy);

const server = app.listen(process.env.PORT || 8080);
server.on('upgrade', wsProxy.upgrade);