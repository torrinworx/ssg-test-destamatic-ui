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

	const serveStatic = (req, res) => {
		const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
		let pathname = parsedUrl.pathname;

		// Normalize: remove trailing slash (except for root)
		if (pathname !== '/' && pathname.endsWith('/')) {
			pathname = pathname.slice(0, -1);
		}

		// Security: prevent path traversal
		pathname = path.normalize(pathname).replace(/^(\.\.[/\\])+/g, '');

		// Resolve base path
		let filePath = path.join(root, 'dist', pathname);

		// Helper to actually send a file
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
				res.end(content);
			});
		};

		// Helper to handle "html resolution" rules
		const tryHtmlVariants = () => {
			// Rule 1: root "/" -> index.html
			if (pathname === '/') {
				const indexPath = path.join(root, 'dist', 'index.html');
				return fs.access(indexPath, fs.constants.F_OK, (err) => {
					if (err) {
						res.writeHead(404);
						res.end('Not Found');
					} else {
						sendFile(indexPath);
					}
				});
			}

			// If no extension: maybe it's a clean URL for an .html
			if (!path.extname(pathname)) {
				// Example: /Landing -> /Landing.html
				const htmlPath = filePath + '.html';
				return fs.access(htmlPath, fs.constants.F_OK, (err) => {
					if (!err) {
						return sendFile(htmlPath);
					}

					// Example: /about -> /about/index.html
					const indexHtmlPath = path.join(filePath, 'index.html');
					fs.access(indexHtmlPath, fs.constants.F_OK, (err2) => {
						if (!err2) {
							return sendFile(indexHtmlPath);
						}

						res.writeHead(404);
						res.end('Not Found');
					});
				});
			}

			// If it had an extension and didn't exist, just 404
			res.writeHead(404);
			res.end('Not Found');
		};

		fs.stat(filePath, (err, stats) => {
			if (!err && stats.isFile()) {
				// Direct file hit (e.g. /styles/main.css)
				return sendFile(filePath);
			}

			if (!err && stats.isDirectory()) {
				// Directory -> try index.html inside it
				const indexFile = path.join(filePath, 'index.html');
				return fs.access(indexFile, fs.constants.F_OK, (accessErr) => {
					if (accessErr) {
						// If no index.html, then run the html variant logic
						return tryHtmlVariants();
					}
					sendFile(indexFile);
				});
			}

			// If stat failed or not a file/dir, try html variants
			return tryHtmlVariants();
		});
	};

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
					vite.middlewares(req, res, (err2) => {
						if (err2) {
							res.writeHead(500);
							res.end(`Error: ${err2.message}`);
							vite.ssrFixStacktrace(err2);
							console.error('Error in Vite middlewares:', err2);
						}
					});
				}
			}
		};

		next();
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
		listen: (port) =>
			server.listen(port || 3000, () => {
				console.log(`Http is serving on http://localhost:${port || 3000}/`);
			}),
	};
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.ENV = 'production';
let server = httpServer();

(async () => {
	server.production({ root: path.join(__dirname, 'build') });
	server.listen(3000);
})();