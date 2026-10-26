const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// ప్రొఫైల్ పిక్ అప్‌డేట్
router.put('/profilepic', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { profilePic: req.body.profilePic });
        res.json({ msg: "Profile Pic Updated" });
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

module.exports = router;