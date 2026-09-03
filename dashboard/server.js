#!/usr/bin/env node

/**
 * Dashboard Server
 * Dependency-free static file server exposing the dashboard UI plus the
 * generated test reports and failure screenshots.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.DASHBOARD_PORT || 4949;

const ROUTES = [
  { prefix: '/screenshots/', dir: path.join(ROOT, 'test', 'screenshots') },
  { prefix: '/reports/', dir: path.join(ROOT, 'test', 'reports') },
  { prefix: '/', dir: path.join(__dirname, 'public') },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function resolveFile(urlPath) {
  const route = ROUTES.find((r) => urlPath.startsWith(r.prefix));
  if (!route) return null;

  const relative = urlPath.slice(route.prefix.length) || 'index.html';
  const filePath = path.normalize(path.join(route.dir, relative));

  if (!filePath.startsWith(route.dir)) return null; // path traversal guard
  return filePath;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = resolveFile(urlPath);

  if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const contentType = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
});
