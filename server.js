#!/usr/bin/env node
var prerender = require('./lib');

const chromeFlags = ['--headless', '--disable-gpu', '--remote-debugging-port=9222'];
if (process.geteuid && process.geteuid() === 0) {
    chromeFlags.push('--no-sandbox');
}
const options = { chromeFlags };

var server = prerender(options);

server.use(prerender.sendPrerenderHeader());
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
