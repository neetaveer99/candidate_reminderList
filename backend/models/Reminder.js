const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  cid: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  reminder: { type: String, required: true },
  dateTime: { type: Date, required: true },
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
