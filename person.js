// models/Person.js
const mongoose = require('mongoose');

// Define the schema for the "Person" model
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  favoriteFoods: { type: [String], required: true }
});

// Export the "Person" model
module.exports = mongoose.model('Person', personSchema);
