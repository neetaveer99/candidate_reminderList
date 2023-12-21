const express = require("express");
const router = new express.Router();


const candidateData = require("../controllers/CandidateController");


router.post("/candidates", candidateData.candidateInfo);


router.get("/get_candidate", candidateData.getcandidata);

router.post('/add_reminder/:_id', candidateData.reminderData);


router.get('/get_reminders/:id', candidateData.getReminders);


module.exports = router;