let Rules = require('../rules.js');
let expect = require('chai').expect;
let sinon = require('sinon');

describe('rules', function () {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.createSandbox();
	})

	it('should create rules', function () {
		let rules = new Rules();
		expect(rules).not.to.be.undefined;
	})

	it('should create rules with preset price', function () {
		let rules = new Rules();
		expect(rules.price).not.to.be.undefined;
	})

	it('should run all rules when apply rules', function () {
		let rules = new Rules();

		let appleTVStub = sandbox.stub(rules, 'appleTVRules');
		let macbookStub = sandbox.stub(rules, 'macbookRules');
		let ipadStub = sandbox.stub(rules, 'ipadRules');
		rules.applyRules();

		expect(appleTVStub.calledOnce).to.be.true;
		expect(macbookStub.calledOnce).to.be.true;
		expect(ipadStub.calledOnce).to.be.true;
	})

	it('should give 1 for free when buying 3 apple tvs', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-original-item',
			price: 99.9
		}];

		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('atv')
			.returns(20.2);
		sandbox.stub(rules, 'countOf')
			.withArgs('atv', merchandiseList)
			.returns(3);
		rules.appleTVRules(merchandiseList);
		expect(merchandiseList.length).to.equal(2);
		expect(merchandiseList[1].price).to.equal(-20.2);
	})

	it('should give 2 for free when buying 6 apple tvs', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-original-item',
			price: 99.9
		}];

		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('atv')
			.returns(20.2);
		sandbox.stub(rules, 'countOf')
			.withArgs('atv', merchandiseList)
			.returns(6);
		rules.appleTVRules(merchandiseList);
		expect(merchandiseList.length).to.equal(3);
		expect(merchandiseList[1].price).to.equal(-20.2);
		expect(merchandiseList[2].price).to.equal(-20.2);
	})

	it('should give 1 for free when buying 5 apple tvs', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-original-item',
			price: 99.9
		}];

		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('atv')
			.returns(20.2);
		sandbox.stub(rules, 'countOf')
			.withArgs('atv', merchandiseList)
			.returns(5);
		rules.appleTVRules(merchandiseList);
		expect(merchandiseList.length).to.equal(2);
		expect(merchandiseList[1].price).to.equal(-20.2);
	})

	it('should give 0 for free when buying 2 apple tvs', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-original-item',
			price: 99.9
		}];

		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('atv')
			.returns(20.2);
		sandbox.stub(rules, 'countOf')
			.withArgs('atv', merchandiseList)
			.returns(2);
		rules.appleTVRules(merchandiseList);
		expect(merchandiseList.length).to.equal(1);
		expect(merchandiseList[0].price).to.equal(99.9);
	})

	it('should apply bulk discount for more than 4 Super Ipad', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-item-here',
			price: 99.3	
		}];
		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('ipd')
			.returns(549.99)
		sandbox.stub(rules, 'countOf')
			.withArgs('ipd', merchandiseList)
			.returns(4);
		rules.ipadRules(merchandiseList);

		expect(merchandiseList.length).to.equal(2);
		expect(merchandiseList[1].price).to.equal(-4*(549.99 - 499.99));
	})

	it('should apply bulk discount for 99 Super Ipad', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-item-here',
			price: 99.3	
		}];
		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('ipd')
			.returns(549.99)
		sandbox.stub(rules, 'countOf')
			.withArgs('ipd', merchandiseList)
			.returns(99);
		rules.ipadRules(merchandiseList);

		expect(merchandiseList.length).to.equal(2);
		expect(merchandiseList[1].price).to.equal(-99*(549.99 - 499.99));
	})

	it('should not apply bulk discount for 3 Super Ipad', function () {
		let rules = new Rules();
		let merchandiseList = [];
		let priceStub = sandbox.stub(rules.price, 'getPriceForSKU');
		sandbox.stub(rules, 'countOf')
			.withArgs('ipd', merchandiseList)
			.returns(2);

		rules.ipadRules(merchandiseList);
		expect(priceStub.notCalled).to.be.true;
		expect(merchandiseList.length).to.equal(0);
	})

	it('should give a vga for free when buying a Macbook Pro', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-item'
		}];
		let countStub = sandbox.stub(rules, 'countOf')
			.withArgs('vga', merchandiseList)
			.returns(1);
		countStub.withArgs('mbp').returns(1);

		let priceStub = sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('vga')
			.returns(89.3)
		rules.macbookRules(merchandiseList);
		expect(merchandiseList.length).to.equal(2);
		expect(merchandiseList[1].price).to.equal(-89.3);
	})

	it('should not give a vga for free when no Macbook Pro is purchased', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-item'
		}];
		let countStub = sandbox.stub(rules, 'countOf')
			.withArgs('vga', merchandiseList)
			.returns(3);
		countStub.withArgs('mbp').returns(0);
		let priceStub = sandbox.stub(rules.price, 'getPriceForSKU');		
		rules.macbookRules(merchandiseList);
		expect(merchandiseList.length).to.equal(1);
		expect(priceStub.notCalled).to.be.true;
	})

	it('should not give vga for free if no vga is purchased', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'some-item'
		}];
		let countStub = sandbox.stub(rules, 'countOf')
			.withArgs('vga', merchandiseList)
			.returns(0);
		countStub.withArgs('mbp', merchandiseList).returns(4);		
		let priceStub = sandbox.stub(rules.price, 'getPriceForSKU');		
		rules.macbookRules(merchandiseList);
		expect(merchandiseList.length).to.equal(1);
		expect(priceStub.notCalled).to.be.true;
	})

	it('should give 3 vga for free when 4 Macbook Pro and 3 vga is been purchased', function () {
		let rules = new Rules();
		let merchandiseList =[];
		sandbox.stub(rules.price, 'getPriceForSKU')
			.withArgs('vga')
			.returns(20.3);
		let countStub = sandbox.stub(rules, 'countOf')
			.withArgs('vga', merchandiseList)
			.returns(3);
		countStub.withArgs('mbp', merchandiseList).returns(4);

		rules.macbookRules(merchandiseList);
		expect(merchandiseList.length).to.equal(1);
		expect(merchandiseList[0].price).to.equal(-3*20.3);
	})

	it('should return the correct count of sku in the list', function () {
		let rules = new Rules();
		let merchandiseList = [{
			sku: 'certain-sku'
		}, {
			sku: 'other-item'
		}, {
			sku: 'certain-sku'
		}, {
			sku: 'other-item-2'
		}, {
			sku: 'certain-sku'
		}];
		let count = rules.countOf('certain-sku', merchandiseList);
		expect(count).to.equal(3);
	})

	it('should return 0 when list is empty', function () {
		let rules = new Rules();
		let merchandiseList = [];
		let count = rules.countOf('certain-sku', merchandiseList);
		expect(count).to.equal(0);
	})

	afterEach(() => {
		sandbox.restore();
	})
})