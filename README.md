# a local test server like cgi
This is a simple local test server. Mostly it is a static file server. POST to `/exec` executes a command on server and returns the result.  
This is an attempt to do quick cgi.

# overview
Both server and client side scripts are written in TypeScript. Server is `node:http`.
- TypeScript files are located in dir `/TS/`
- define executable command in `/server/TS/exec.ts`

# how to use
```bash
git clone https://github.com/halfminami/exec-on-server-nodehttp.git
cd exec-on-server-nodehttp
npm i
npm run tsc-all
```
- compile typescript `npm run tsc-all`
- start server `npm run serve`
