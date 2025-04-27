const express = require('express');
const router = express.Router();

router.get('/jobs', (req, res) => {
  res.json({ message: 'Job list endpoint' });
});

module.exports = router;