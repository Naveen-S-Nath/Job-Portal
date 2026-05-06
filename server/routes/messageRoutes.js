const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');

router.get('/conversations', verifyToken, getConversations);
router.get('/:applicationId', verifyToken, getMessages);
router.post('/:applicationId', verifyToken, sendMessage);

module.exports = router;