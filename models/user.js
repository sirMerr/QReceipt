const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// wdpoints are world domination points
// userId is NOT the same as discord's hella long snowflake one.
const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	firstname: String,
	lastname: String,
	usertype: { type: String, default: 'consumer' } // consumer admin store
});

// expose userSchema
module.exports = mongoose.model('User', userSchema);
