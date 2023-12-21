const Candidate = require("../models/Candidate");
const Reminder = require("../models/Reminder");



//api for add new candidate
exports.candidateInfo = async (req, res) => {
    try {
      const candidate = await Candidate.create(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  

  //api for get candidate list with latest reminders

const currentDate = new Date();
const currentUtcDate = new Date(currentDate.toISOString());

exports.getcandidata = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const candidatesWithReminders = await Promise.all(candidates.map(async (candidate) => {
      const latestFutureReminder = await Reminder.findOne({
        cid: candidate._id,
        dateTime: { $gte: currentUtcDate }, // Filter for reminders on or after today (in UTC)
      }).sort({ dateTime: 'asc' });
console.log("crr",currentUtcDate);
      console.log(`Candidate: ${candidate.name}, Latest Future Reminder:`, latestFutureReminder);

      return { candidate, latestFutureReminder };
    }));

    // Sort the candidates based on the latest future reminder date
    const sortedCandidates = candidatesWithReminders.sort((a, b) => {
      if (!a.latestFutureReminder) return 1;
      if (!b.latestFutureReminder) return -1;
      return a.latestFutureReminder.dateTime - b.latestFutureReminder.dateTime;
    });

    res.status(200).json(sortedCandidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




//api for add new reminder


exports.reminderData = async (req, res) => {
    const candidateId = req.params._id;
  
    try {
      // Ensure that you have the required data in the request body
      const { reminder, dateTime } = req.body;
  
      // Convert the dateTime to UTC format before saving
      const utcDateTime = new Date(dateTime).toISOString();
  
      // Create a new reminder for the specified candidate
      const newReminder = await Reminder.create({
        cid: candidateId,
        reminder,
        dateTime: utcDateTime,
      });
  
      // Push the Reminder ID to the reminders array in the Candidate document
      const candidate = await Candidate.findByIdAndUpdate(candidateId, {
        $push: { reminders: newReminder._id },
      }, { new: true });
  
      res.status(201).json(newReminder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  




//get reminders list
  exports.getReminders = async (req, res) => {
    const candidateId = req.params.id;
  
    try {
      // Assuming you have a reference to Reminder in your Candidate model
      console.log('Candidate ID:', candidateId);
      const candidateWithReminders = await Candidate.findById(candidateId).populate('reminders');
      console.log('Candidate with Reminders:', candidateWithReminders);
        
      if (!candidateWithReminders) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      const reminders = candidateWithReminders.reminders;
  
      res.status(200).json(reminders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };