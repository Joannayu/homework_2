let expect = require('chai').expect;
let Price = require('../price.js');

describe('should create price with preset json', function () {
	it('should create price', function () {
		let price = new Price();
		expect(price.priceList).not.to.be.undefined;
	})	
})

describe('should get price for sku', function () {
	it('should get price for sku', function () {
		let pr = new Price();
		pr.priceList = [{
			sku: 'banana', 
			price: 20.1
		}, {
			sku: 'orange',
			price: 16
		}, {
			sku: 'kiwi',
			price: 0.01
		}];
		expect(pr.getPriceForSKU('kiwi')).to.equal(0.01);
		expect(pr.getPriceForSKU('orange')).to.equal(16);
		expect(pr.getPriceForSKU('banana')).to.equal(20.1);
	})

	it('should return undefined when price list is undefined', function () {
		let pr = new Price();
		pr.priceList = undefined;
		expect(pr.getPriceForSKU('kiwi')).to.be.undefined;
	})

	it('should return undefined when price list is empty', function () {
		let pr = new Price();
		pr.priceList = [];
		expect(pr.getPriceForSKU('kiwi')).to.be.undefined;
	})

	it('should return undefined when sku is not found', function () {
		let pr = new Price();
		pr.priceList = [{
			sku: 'banana',
			price: 30
		}];

		expect(() => pr.getPriceForSKU('kiwi')).not.to.throw();
		expect(pr.getPriceForSKU('kiwi')).to.be.undefined;
	})
})