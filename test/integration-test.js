let Checkout = require('../checkout.js');
let Rules = require('../rules.js');
let expect = require('chai').expect;

describe('integration', function () {
	it('example 1', function () {
		let rules = new Rules();
		let co = new Checkout(rules);

		co.scan('atv');
	  	co.scan('atv');
	  	co.scan('atv');

	  	co.scan('vga');

	  	expect(co.total()).to.equal(249);
	})

	it('example 2', function () {
		let rules = new Rules();
		let co = new Checkout(rules);

		co.scan('atv');
	  	co.scan('ipd');
	  	co.scan('ipd');

	  	co.scan('atv');

 		co.scan('ipd');
	  	co.scan('ipd');
	  	co.scan('ipd');
	  	expect(co.total()).to.equal(2718.95);
	})

	it('example 3', function () {
		let rules = new Rules();
		let co = new Checkout(rules);

		co.scan('mbp');
	  	co.scan('vga');
	  	co.scan('ipd');

	  	expect(co.total()).to.equal(1949.98);
	})

	it('example 4', function () {
		let rules = new Rules();
		let co = new Checkout(rules);

		co.scan('atv');
	  	co.scan('mbp');
	  	co.scan('mbp');

	  	co.scan('atv');

 		co.scan('vga');
	  	co.scan('ipd');
	  	co.scan('ipd');
	  	expect(co.total()).to.equal(109.5*2+1399.99*2+549.99*2);
	})
})