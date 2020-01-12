let priceJson = require('./price-json.js');

class Price {
	constructor() {
		this.priceList = priceJson;
	}

	getPriceForSKU(sku){
		if (!this.priceList || this.priceList.length < 1) {
			return;
		}
		let merchandise = this.priceList.find(p => p.sku === sku);
		
		if (!merchandise) {
			return;
		}

		return merchandise.price;
	}
}

module.exports = Price;