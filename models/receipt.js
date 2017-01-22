const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// wdpoints are world domination points
// userId is NOT the same as discord's hella long snowflake one.
const receiptSchema = new Schema({
	hash: String,
	// content: { },
	user: { type: Schema.Types.ObjectId, ref: 'User' }
});

// expose userSchema
module.exports = mongoose.model('Receipt', receiptSchema);
