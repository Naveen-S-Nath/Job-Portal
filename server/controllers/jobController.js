const Job = require('../models/Job');

// GET all jobs — public
const getAllJobs = async (req, res) => {
  try {
    // populate replaces postedBy ID with the actual user's name and email
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single job by ID — public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST create a job — recruiters only
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      postedBy: req.user.userId  // comes from the verified JWT token
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT update a job — only the recruiter who posted it
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // make sure the person updating is the one who posted it
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised to update this job' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Job updated', job: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a job — only the recruiter who posted it
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };