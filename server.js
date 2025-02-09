const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MAX_SIZE = 10;

const cache = {};

app.use(bodyParser.json());

// POST 
app.post('/cache', (req, res) => {
    const { key, value } = req.body;

    // Ensure data contains key and value
    if (!key || !value) {
        return res.status(400).json({ error: "Invalid input. 'key' and 'value' are required." });
    }

    if (Object.keys(cache).length >= MAX_SIZE) {
        return res.status(400).json({ error: `Cache limit reached. Cannot store more than ${MAX_SIZE} items.` });
    }

    // Store in cache
    cache[key] = value;

    return res.status(201).json({ message: `Key '${key}' stored successfully.` });
});

// Get all
app.get('/cache/', (req, res) => {
    res.status(200).json({ cache });
});


// GET 
app.get('/cache/:key', (req, res) => {
    const { key } = req.params;

    if (!(key in cache)) {
        return res.status(404).json({ error: `Key '${key}' not found in cache.` });
    }

    res.status(200).json({ key: key, value: cache[key] });
});

// DELETE 
app.delete('/cache/:key', (req, res) => {
    const { key } = req.params;

    if (!(key in cache)) {
        return res.status(404).json({ error: `Key '${key}' not found in cache.` });
    }

    // Remove the key-value pair from the cache
    delete cache[key];

    return res.status(200).json({ message: `Key '${key}' removed successfully.` });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
