var modRewrite = require('connect-modrewrite')

module.exports = function (options) {
	var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')

	var slug = options.slug
	var viewerDomain = options.viewerDomain

	//Deprecated option url
	if (options.url) {
		slug = options.url.match(exp)[3]
		viewerDomain = options.url.match(exp)[1]
	}

	if (!viewerDomain) {
		viewerDomain = 'https://viewer.mediafly.com'
	}

	var modRewriteConfig = [
		'^(.*)/interactive/' + slug + '/(.*)$ /$2 [L]',
		'^/(.*)$ ' + viewerDomain + '/$1 [P, L]'
	]

	return modRewrite(modRewriteConfig)
}
