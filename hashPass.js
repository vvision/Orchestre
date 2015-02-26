var shasum = require('crypto').createHash('sha512');

var args = process.argv.slice(2);
var plainTextPassword = args[0];

shasum.update(plainTextPassword);
var hashedPassword = shasum.digest('hex');

console.log('Please copy the following hashed password in config.json : ');
console.log(hashedPassword);
