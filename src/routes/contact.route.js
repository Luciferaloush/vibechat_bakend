const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const auth = require('../middleware/auth.middlewre');

router.get('/', auth, contactController.fetchContacts);
router.post('/add', auth, contactController.addContact);
router.get('/recent-contact', auth, contactController.recentContact );

module.exports = router;