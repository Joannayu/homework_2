let Checkout = require('./checkout.js');
let Rules = require('./rules.js');

function main () {
	let rules = new Rules();
	let co = new Checkout(rules);

	co.scan('atv');
  	co.scan('atv');
  	co.scan('atv');

  	co.scan('vga');

  	let total = co.total();
  	console.log('$'+total);
}

main();