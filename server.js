// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Person = require('./models/Person');

// Load environment variables from the .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// CRUD Operations

// 1. Create a new Person record
app.post('/api/person', async (req, res) => {
  const { name, age, favoriteFoods } = req.body;

  const newPerson = new Person({
    name,
    age,
    favoriteFoods
  });

  try {
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Create many Person records
app.post('/api/people', async (req, res) => {
  const arrayOfPeople = req.body;

  try {
    const people = await Person.create(arrayOfPeople);
    res.status(201).json(people);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Get all people
app.get('/api/people', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Find one person by favorite food
app.get('/api/people/favorite-food/:food', async (req, res) => {
  const food = req.params.food;
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Find a person by ID
app.get('/api/person/:id', async (req, res) => {
  const personId = req.params.id;
  try {
    const person = await Person.findById(personId);
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Update a person's favorite foods
app.put('/api/person/update/:id', async (req, res) => {
  const personId = req.params.id;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      personId,
      { $push: { favoriteFoods: 'hamburger' } },
      { new: true }
    );
    res.json(updatedPerson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Update a person's age
app.put('/api/person/update-age/:name', async (req, res) => {
  const personName = req.params.name;
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    res.json(updatedPerson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. Delete a person by ID
app.delete('/api/person/:id', async (req, res) => {
  const personId = req.params.id;
  try {
    const deletedPerson = await Person.findByIdAndRemove(personId);
    res.json({ message: 'Person deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 9. Delete all people named 'Mary'
app.delete('/api/people', async (req, res) => {
  try {
    const result = await Person.remove({ name: 'Mary' });
    res.json({ message: 'Deleted people named Mary', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 10. Find people who like burritos, sort by name, limit to 2, and hide their age
app.get('/api/people/burritos', async (req, res) => {
  try {
    const people = await Person.find({ favoriteFoods: 'burrito' })
      .sort({ name: 1 })
      .limit(2)
      .select('-age')
      .exec();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
