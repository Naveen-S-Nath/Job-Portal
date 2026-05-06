const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job Portal API is running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // preload all models after connection
    require('./models/User');
    require('./models/Job');
    require('./models/Application');
    require('./models/Message');


    // load routes after models
    const authRoutes = require('./routes/authRoutes');
    const jobRoutes = require('./routes/jobRoutes');
    const applicationRoutes = require('./routes/applicationRoutes');
    const messageRoutes = require('./routes/messageRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/applications', applicationRoutes);
    app.use('/api/messages', messageRoutes);

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('DB connection failed:', err));