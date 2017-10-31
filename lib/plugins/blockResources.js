const minimatch = require('minimatch');
const url = require('url');
const path = require('path');

const globalBlockedDomains = [
    "google-analytics.com",
    "www.googletagmanager.com",
    "secure.livechatinc.com",
    "ping.navigator.io",
    "api.mixpanel.com",
    "fonts.googleapis.com",
    "stats.g.doubleclick.net",
    "mc.yandex.ru",
    "use.typekit.net",
    "beacon.tapfiliate.com",
    "js-agent.newrelic.com",
    "api.segment.io",
    "woopra.com",
    "static.olark.com",
    "static.getclicky.com",
    "fast.fonts.com",
    "youtube.com/embed",
    "cdn.heapanalytics.com",
    "googleads.g.doubleclick.net",
    "pagead2.googlesyndication.com",
    "fullstory.com",
    "navilytics.com",
    "log.optimizely.com",
    "hn.inspectlet.com",
    "tpc.googlesyndication.com",
    "partner.googleadservices.com"
];

const globalBlockedFiles = [
	"*.ttf",
	"*.eot",
	"*.otf",
	"*.woff",
	"*.woff2",
	"*.png",
	"*.gif",
	"*.tiff",
	"*.pdf",
	"*.jpg",
	"*.jpeg",
	"*.svg",
	"*.ico",
	"*.mp4",
	"*.css*",
	"*.ogg",
	"*.essl",
];

module.exports = {
    init: () => {
    	this.blockedDomains = globalBlockedDomains.concat(process.env.BLOCKED_RESOURCES_DOMAINS && process.env.BLOCKED_RESOURCES_DOMAINS.split(',') || []);
    	this.blockedFiles = globalBlockedFiles;
    },
	tabCreated: async (req, res, next) => {
    	const shallNotPass = (request) => {
    		const { host, pathname } = url.parse(request.url);
    		const basename = path.basename(pathname);
    		return this.blockedDomains.some((domainPattern) => minimatch(host, domainPattern)) ||
                this.blockedFiles.some((filePattern) => minimatch(basename, filePattern));
		};
        req.prerender.tab.Network.setRequestInterceptionEnabled({enabled: true}).then(() => {
            req.prerender.tab.Network.requestIntercepted(({interceptionId, request}) => {
                const blocked = shallNotPass(request);
                req.prerender.tab.Network.continueInterceptedRequest({
                    interceptionId,
                    errorReason: blocked ? 'Aborted' : undefined
                });
            });
            next();
		});
	}
};