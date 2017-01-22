const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGODB_URI = 'mongodb://heroku_q7ptrvv3:qqu4u6tnv95st63dq4ass74ntd@ds117849.mlab.com:17849/heroku_q7ptrvv3';

const app = express();

// this will let us get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set port
app.set('port', process.env.PORT || 5000);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static('www')); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')

app.use((req, res, next) => {
	// logging
	console.log(moment().format('MM-DD-YYYY, hh:mm:ss') + '-- ' + req.method + ': ' + req.originalUrl);
	next();
});
// stops deprecation warnings & misuse
mongoose.Promise = global.Promise;

// get models
const Users = require('./models/user');
const Receipts = require('./models/receipt');

mongoose.connect(MONGODB_URI);

// Error handler for the api
function handleError(res, reason, message, code) {
	console.log('API Error: ' + reason);
	res.status(code || 500).json({ Error: message });
}
// GET: retrieve all users
app.get('/api/users', (req, res) => {
	Users.find({})
	.exec((err, docs) => {
		if (err) {
			handleError(res, err.message, 'Failed to get users');
		} else {
			res.status(200).json(docs);
		}
	});
});

// POST: create a new user
app.post('/api/users', (req, res) => {
	const newUser = new Users();
	const param = req.body;
	newUser.username = param.username;
	newUser.email = param.email;
	newUser.password = param.password;
	newUser.firstname = param.firstname;
	newUser.lastname = param.lastname;
	newUser.usertype = param.usertype;

	Users.create(newUser, (err, doc) => {
		if (err) {
			handleError(res, err.message, 'Failed to add user');
		} else {
			res.status(201).json(doc);
		}
	});
});

// GET: gets all receipts
app.get('/api/receipts', (req, res) => {
	Receipts.find({})
	.select('-__v')
	.populate({ path: 'user', select: '-__v' })
	.lean()
	.exec((err, docs) => {
		if (err) {
			handleError(res, err.message, 'Failed to get receipts');
		} else {
			res.status(200).json(docs);
		}
	});
});

// POST: create a new receipt for a user
app.post('/api/receipts/:user_id', (req, res) => {
	const newReceipt = new Receipts();
	const param = req.body;
	Users.findOne({ _id: req.params.user_id }, (err, user) => {
		if (err) {
			handleError(res, err.message, 'Failed to find this user');
		} else {
			newReceipt.user = user;
			newReceipt.hash = param.hash;
			Receipts.create(newReceipt, (err, doc) => {
				if (err) {
					handleError(res, err.message, 'Failed to add receipt');
				} else {
					res.status(201).json(doc);
				}
			});
		}
	});
});
// GET: get hello world response
app.get('/', (req, res) => {
	res.send('Hello World!!');
});

app.listen(app.get('port'), () => {
	console.log('Node app is running at localhost:' + app.get('port'));
});
