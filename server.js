const { createServer } = require('http');
const { parse } = require('url');
const next = require('next')

const dev = process.env.NODE_ENV === 'production';
const hostname = dev ? '127.0.0.1' : 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer( async (req, res) => {
        try{
            const parsedURL = parse(req.url, true)
            const { pathname, query } = parsedURL;

            if(pathname === '/a') {
                await app.render(req, res, '/a', query)
            } else if(pathname === '/b') {
                await app.render(req, res, '/b', query)
            } else {
                await handle(req, res, parsedURL)
            }

        } catch (err){
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('Internal Server Error');
        }
    }).listen(port, (err) => {
        if(err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    })
})