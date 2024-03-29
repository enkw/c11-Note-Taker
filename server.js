const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Variable path to the database
const notePath = path.resolve(__dirname, 'db', 'db.json');

let notes = [];

// Checks db.json for existing notes
// Doesn't appear to work yet
fs.readFile(notePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading notes from db.json', err);
        return;
    }
    try {
        notes = JSON.parse(data);
    }
    catch (error) {
        console.error('Error parsing notes from db.json', error);
    }
});

// Saves notes to db.json
// Appears to be writing to db.json, but needs further testing
const saveNotes = () => {
    fs.writeFile(notePath, JSON.stringify(notes), (err) => {
        if (err) {
            console.error('Error saving notes to db.json', err);
        }
    });
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uuidv4(),
    };

    notes.push(newNote);
    saveNotes();
    res.json(newNote);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);