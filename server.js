// Set the port number, using the environment variable PORT if available, otherwise defaulting to 3001
const PORT = process.env.PORT || 3001;

// Import required modules
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Import the Express module and create an instance of an Express application
const express = require('express');
const app = express();

// Import the existing notes from the JSON file
const allNotes = require('./db/db.json');

// Middleware to parse URL-encoded data and JSON data from the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));

// GET route to fetch all notes, excluding the first element of the array
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

// GET route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET route to serve the notes HTML page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Fallback GET route to serve the main HTML page for any unspecified routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to create a new note and add it to the notes array
function createNewNote(body, notesArray) {
    const newNote = body;
    // Ensure notesArray is an array
    if (!Array.isArray(notesArray))
        notesArray = [];

    // Increment the id counter and assign a unique ID to the new note
    body.id = notesArray[0];
    notesArray[0]++;
    newNote.id = uuid.v4();

    // Add the new note to the array and write the updated array to the JSON file
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// POST route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

// Function to delete a note by its ID
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        // Find the note with the matching ID and remove it from the array
        if (note.id == id) {
            notesArray.splice(i, 1);
            // Write the updated array to the JSON file
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}

// DELETE route to remove a note by its ID
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});