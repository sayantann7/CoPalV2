const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://officialsayantannandi:VZkMn0d8y7WGt5lR@copal.trrkow5.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Student model
const studentSchema = new mongoose.Schema({
  name: String,
  city: String,
  college: String,
  instagram: String
});


const Student = mongoose.model('Student', studentSchema);


// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to add a new student
app.post('/addStudent', async (req, res) => {
  const { name, city, college, instagram } = req.body;

  try {
    const existingStudent = await Student.findOne({ name, city, college, instagram });
    if (!existingStudent) {
      const newStudent = new Student({ name, city, college, instagram });
      await newStudent.save();
    }
    res.status(201).json({ message: 'Student processed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch students by city and college, excluding the current user
app.get('/students', (req, res) => {
  const { city, college, name, instagram } = req.query;
  Student.find({ city, college, $nor: [{ name }, { instagram }] }, (err, students) => {
    if (err) return res.status(500).send(err);
    res.json(students);
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// module.exports = app;