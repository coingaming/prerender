const cacheManager = require('cache-manager');

module.exports = {
    init: () => {
        this.cache = cacheManager.caching({
            store: 'memory', max: process.env.CACHE_MAXSIZE || 100, ttl: process.env.CACHE_TTL || 60 * 60/*seconds*/
        });
    },

    requestReceived: (req, res, next) => {
        this.cache.get(req.prerender.url, function (err, result) {
            if (!err && result) {
                res.wasCached = true;
                res.send(200, result);
            } else {
                next();
            }
        });
    },

    beforeSend: (req, res, next) => {
        if (!res.wasCached && req.prerender.statusCode === 200) {
            this.cache.set(req.prerender.url, req.prerender.documentHTML);
        }
        next();
    }
};
