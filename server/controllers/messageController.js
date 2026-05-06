const Message = require('../models/Message');
const Application = require('../models/Application');

// get all accepted applications for this user and their messages
const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    // find accepted applications involving this user
    const query = role === 'candidate'
      ? { candidate: userId, status: 'accepted' }
      : { status: 'accepted' };

    const applications = await Application.find(query)
      .populate('job', 'title company')
      .populate('candidate', 'name')
      .populate({
        path: 'job',
        populate: { path: 'postedBy', select: 'name' }
      });

    // if recruiter, only show applications for their jobs
    const filtered = role === 'recruiter'
      ? applications.filter(a => a.job?.postedBy?._id?.toString() === userId)
      : applications;

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get messages for a specific application
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ application: req.params.applicationId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// send a message
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const application = await Application.findById(req.params.applicationId);

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.status !== 'accepted') {
      return res.status(403).json({ message: 'Messaging only available for accepted applications' });
    }

    const message = await Message.create({
      application: req.params.applicationId,
      sender: req.user.userId,
      text
    });

    const populated = await message.populate('sender', 'name role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };