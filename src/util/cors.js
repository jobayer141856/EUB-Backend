import cors from 'cors';

const whitelist = [
	// * VPS
	'https://tsl.fortunezip.com',
	'https://tslbackend.fortunezip.com',
	//* FZL H/O
	'http://103.147.163.46:3005',
	'http://103.147.163.46:4010',
	'http://103.147.163.46:3000',
	'http://103.147.163.46:4025',
	'http://103.147.163.46:4026',

	//* Development
	'http://localhost:3005',
	'http://localhost:4010',
	'http://localhost:3000',
	'http://localhost:4025',
	'http://localhost:4026',

	//* Office Server PC
	'http://192.168.10.48:3005',
	'http://192.168.10.48:4010',
	'http://192.168.10.48:3000',
	'http://192.168.10.48:4025',
	'http://192.168.10.48:4026',

	//* RBR LAPTOP
	'http://192.168.10.78:4010',

	//* RBR Home
	'http://192.168.1.108:4175',
];

var corsOptionsDelegate = function (req, callback) {
	var corsOptions;
	if (whitelist.indexOf(req?.header('Origin')) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

export default cors(corsOptionsDelegate);
