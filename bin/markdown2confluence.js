#!/usr/bin/env node
let markdown2confluence = require('../');
let fs = require('fs');
let path = require('path');
let getStdin = require('get-stdin');

let filename = process.argv[2];

//Handle File
if (filename !== null) {
  let filepath = path.resolve(process.cwd(), filename);

  fs.readFile(filepath, (err, buffer) => {
  	if (err) {
  		console.error('An error occurred while parsing');
  		console.error(err);
  		return;
		}

		let input = buffer.toString();

    console.log(markdown2confluence(input));
  });

} else { //Handle STDIN
	getStdin().then(input => {
		console.log(markdown2confluence(input));
	});
}
