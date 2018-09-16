const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const P = require('bluebird');
const timestamps = require('mongoose-timestamp');
const update = require('mongoose-model-update');

/**
 * Amenity Schema
 */

let Message = new Schema({
  _sender: {
    type: Schema.Types.ObjectId,
    required: 'Sender is required',
    ref: 'User'
  },
  _receiver: {
    type: Schema.Types.ObjectId,
    required: 'Receiver is required',
    ref: 'User'
  },
  send_time: {
    type: Date,
  },
  content: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false
  },
  _boat: {
    type: Schema.Types.ObjectId,
    ref: 'Boat'
  }
});

Message.plugin(timestamps);

Message.statics.isValidId = function (messsageId) {
};

module.exports = mongoose.model('Message', Message);
