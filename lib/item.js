var request = require('request')

function get(itemId, productId, accessToken, cb) {

	var url = 'https://launchpadapi.mediafly.com/2/items/' + itemId + '?accessToken=' + accessToken + '&productId=' + productId

	request({
		method: 'GET',
		uri: url
	}, (error, response, body) => {
		if (!error) {
			cb(JSON.parse(body))
		} else {
			cb(error)
		}
	})
}

function getItemAssetState(itemId, productId, accessToken, cb) {
	get(itemId, productId, accessToken, item => {
		if (!item.response.asset)
		{
			cb('empty')
			return
		}

		if (item.response.errorMessage)
		{
			cb('error')
			return
		}

		if (item.response.asset.estimatedRemainingTime)
		{
			cb('processing')
			return
		}

		cb('processed')
	})
}

module.exports = {
	get: get,
	getItemAssetState: getItemAssetState
}