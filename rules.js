let Price = require('./price.js');

class Rules {
	constructor() {
		this.price = new Price();
	}

	applyRules(merchandiseList){
		this.appleTVRules(merchandiseList);
		this.ipadRules(merchandiseList);
		this.macbookRules(merchandiseList);
	}

	appleTVRules(merchandiseList) {
		let countOfAppleTV = this.countOf('atv', merchandiseList);
		let countOfDeal = Math.floor(countOfAppleTV / 3);
		for (let i = 0; i < countOfDeal; i ++) {
			merchandiseList.push({
				sku:'deal-atv',
				price: -1 * this.price.getPriceForSKU('atv')
			})
		}
	}

	ipadRules(merchandiseList) {
		let countOfIpad = this.countOf('ipd', merchandiseList);
		if (countOfIpad < 4) {
			return;
		}

		let priceDiff = this.price.getPriceForSKU('ipd') - 499.99;
		let discountAmount = countOfIpad * (priceDiff);

		merchandiseList.push({
			sku: 'deal-ipd',
			price: -1 * discountAmount
		})
	}

	macbookRules(merchandiseList) {
		let countOfMbp = this.countOf('mbp', merchandiseList);
		let countOfVga = this.countOf('vga', merchandiseList);

		let countOfDeal = Math.min(countOfMbp, countOfVga);

		if (countOfDeal > 0) {
			merchandiseList.push({
				sku: 'deal-mbp',
				price: -1 * this.price.getPriceForSKU('vga') * countOfDeal
			});
		}
	}

	countOf(sku, merchandiseList) {
		return merchandiseList.filter(m => m.sku === sku).length;
	}
}

module.exports = Rules;