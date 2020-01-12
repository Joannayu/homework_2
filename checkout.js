let Price = require('./price.js');

class Checkout {
	constructor(rules) {
		this.merchandiseList = [];
		this.price = new Price();
		this.rules = rules;
	}

	scan(sku) {
		this.merchandiseList.push({
			sku: sku,
			price: this.price.getPriceForSKU(sku)
		});

	}

	total() {
		if (this.rules) {
			this.rules.applyRules(this.merchandiseList);
		}

		return this.merchandiseList
			.map(item => item.price)
			.reduce((sum, price1) => sum + price1, 0);
	}
}

module.exports = Checkout;