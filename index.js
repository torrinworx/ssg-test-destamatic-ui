import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const mimeTypes = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.otf': 'font/otf',
	'.eot': 'application/vnd.ms-fontobject',
	'.xml': 'application/xml',
	'.pdf': 'application/pdf',
	'.txt': 'text/plain',
};

const httpServer = () => {
	let root;
	let vite;
	let server;
	const middlewares = [];

	const handleRequest = (req, res) => {
		let idx = 0;

		const next = (err) => {
			if (err) {
				res.writeHead(500);
				res.end(`Middleware error: ${err.message}`);
				console.error('Middleware error:', err);
				return;
			}

			const middleware = middlewares[idx++];
			if (middleware) {
				middleware(req, res, next);
			} else {
				if (process.env.ENV === 'production') {
					serveStatic(req, res);
				} else {
					vite.middlewares(req, res, (err) => {
						if (err) {
							res.writeHead(500);
							res.end(`Error: ${err.message}`);
							vite.ssrFixStacktrace(err);
							console.error('Error in Vite middlewares:', err);
						}
					});
				}
			}
		};

		next();
	};

	const serveStatic = (req, res) => {
		const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
		let pathname = parsedUrl.pathname;

		// Normalize path (remove trailing slash except for root)
		if (pathname !== '/' && pathname.endsWith('/')) {
			pathname = pathname.slice(0, -1);
		}

		let filePath = path.join(root, pathname);

		const sendFile = (fullPath) => {
			fs.readFile(fullPath, (err, content) => {
				if (err) {
					res.writeHead(500);
					res.end(`Error: ${err.code}`);
					return;
				}
				const extname = path.extname(fullPath);
				const contentType = mimeTypes[extname] || 'application/octet-stream';
				res.writeHead(200, { 'Content-Type': contentType });
				res.end(content, 'utf-8');
			});
		};

		fs.stat(filePath, (err, stats) => {
			if (!err && stats.isDirectory()) {
				// Directory: try index.html inside it
				const indexPath = path.join(filePath, 'index.html');
				fs.stat(indexPath, (errIndex, statsIndex) => {
					if (!errIndex && statsIndex.isFile()) {
						sendFile(indexPath);
					} else {
						// Fallback to root index.html (SPA entry point / error page)
						sendFile(path.join(root, 'index.html'));
					}
				});
			} else if (!err && stats.isFile()) {
				// Direct file match: serve it
				sendFile(filePath);
			} else {
				// No file or directory found for this path

				// SPECIAL CASE: block /index from mapping to /index.html
				// You can extend this check if needed (e.g. /index/ or /index.html)
				const isIndexLike =
					pathname === '/index' ||
					pathname === '/index.html';

				if (isIndexLike) {
					// Do NOT try filePath + '.html', just fall back to SPA/404
					sendFile(path.join(root, 'index.html'));
					return;
				}

				// Pretty URL: try adding .html (e.g. /about -> /about.html)
				const htmlPath = filePath + '.html';
				fs.stat(htmlPath, (errHtml, statsHtml) => {
					if (!errHtml && statsHtml.isFile()) {
						sendFile(htmlPath);
					} else {
						console.log("FALLBACK TRIGGERED.", htmlPath)
						// Fallback to root index.html (SPA/404)
						sendFile(path.join(root, 'index.html'));
					}
				});
			}
		});
	};

	return {
		middleware: (fn) => middlewares.push(fn),
		production: ({ root: rootPath }) => {
			root = rootPath;
			server = http.createServer(handleRequest);
		},
		development: ({ vite: viteInstance }) => {
			vite = viteInstance;
			server = http.createServer(handleRequest);
		},
		listen: (port) => server.listen(port || 3000, () => {
			console.log(`Http is serving on http://localhost:${port || 3000}/`);
		})
	}
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.ENV = 'production';
let server = httpServer();

(async () => {
	server.production({ root: path.join(__dirname, 'build', 'dist') });
	server.listen(3000);
})();
