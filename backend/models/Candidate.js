const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' }],

});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
