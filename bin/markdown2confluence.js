#!/usr/bin/env node
let markdown2confluence = require('../');
let fs = require('fs');
let path = require('path');
let getStdin = require('get-stdin');

let args = process.argv.slice(2);

//Handle Files
if (args.length > 0) {

	args.forEach(arg => {
		let filepath = path.resolve(process.cwd(), arg);

		fs.readFile(filepath, (err, buffer) => {
			if (err) {
				console.error('An error occurred while parsing');
				console.error(err);
				return;
			}

			let input = buffer.toString();

			console.log(markdown2confluence(input));
		});
	});

} else { //Handle STDIN
	getStdin().then(input => {
		console.log(markdown2confluence(input));
	});
}
