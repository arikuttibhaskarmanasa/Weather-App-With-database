const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/weatherApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schema and model
const searchSchema = new mongoose.Schema({
    city: String,
    date: { type: Date, default: Date.now }
});
const Search = mongoose.model('Search', searchSchema);

// POST endpoint to save city search
app.post('/api/search', async (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).send("City is required");

    const newSearch = new Search({ city });
    await newSearch.save();
    res.status(201).send("Search saved");
});

// GET endpoint to retrieve search history (optional)
app.get('/api/searches', async (req, res) => {
    const searches = await Search.find().sort({ date: -1 }).limit(10);
    res.json(searches);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
