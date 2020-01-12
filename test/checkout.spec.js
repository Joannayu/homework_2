let Checkout = require('../checkout.js');
let expect = require('chai').expect;
let sinon = require('sinon');
let Rules = require('../rules.js');
let Price = require('../price.js');
describe('should create checkout', function () {
	it('create checkout', function () {
		let checkout = new Checkout();
		expect(checkout).not.to.be.undefined;
	})

	it('create with merchandise list', function () {
		let co = new Checkout();
		expect(co.merchandiseList).not.to.be.undefined;
	})

	it('create with price', function () {
		let co = new Checkout();
		expect(co.price).not.to.be.undefined;
	})

	it('create with rules', function () {
		let rules = new Rules();
		let co = new Checkout(rules);
		expect(co.rules).to.equal(rules);
	})
})

describe('should scan a product', function () {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.createSandbox();
	})

	it('should add the product to merchandise list after scan', function () {
		let co = new Checkout();
		sandbox.stub(co.price, 'getPriceForSKU');

		co.scan('abc');
		expect(co.merchandiseList.length).to.equal(1);
		expect(co.merchandiseList[0].sku).to.equal('abc');
	})

	it('should add product with price after scan', function () {
		let co = new Checkout();
		sandbox.stub(co.price, 'getPriceForSKU').returns(21.3);
		co.scan('abc');
		expect(co.merchandiseList.length).to.equal(1);
		expect(co.merchandiseList[0].price).to.equal(21.3);
	})

	afterEach(() => {
		sandbox.restore();
	})
})

describe('should calculate total', function () {
	it('should calculate total', function () {
		let co = new Checkout();
		co.merchandiseList = [{
			sku: 'item1',
			price: 90.2
		}, {
			sku: 'item2', 
			price: 300
		}, {
			sku: 'reduce',
			price: -200
		}];

		let total = co.total();

		expect(total).to.equal(90.2+300-200);
	})

	it('should apply rules before calculate total', function () {
		let co = new Checkout();
		let rules = new Rules();
		co.rules = rules;

		let sandbox = sinon.createSandbox();
		let rulesStub = sandbox.stub(rules, 'applyRules');
		let merchandiseList = [{
			price: 11
		}, {
			price: 13.2
		}];
		co.merchandiseList = merchandiseList;
		co.total();

		expect(rulesStub.calledOnce).to.be.true;
		expect(rulesStub.calledWithExactly(merchandiseList)).to.be.true;
	})

	it('should not crash when no rules are set', function () {
		let co = new Checkout();
		expect(() => co.total()).not.to.throw();
	})
})

