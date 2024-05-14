const express = require('express');
const path = require('path');
const fs = require('fs');
const util  = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('./develop/public'));

app.get('/api/notes', function(req, res) {
    readFile('./develop/db/db.json', 'utf8').then(function(data) {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    });
})

app.post('/api/notes', function(req, res) {
    const note = req.body;
    readFile('./develop/db/db.json', 'utf8').then(function(data) {
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length
    note.push(note);
    return notes;
    }).then(function(notes) {
        writeFile('./develop/db/db.json', JSON.stringify(notes))
            res.json(notes);
        });
    
});

app.delete('/api/notes/:id', function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFile('./develop/db/db.json', 'utf8').then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotes = [];
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id!== idToDelete) {
                newNotes.push(notes[i]);
            }
        }
        return newNotes;
        }).then(function(newNotes) {
            writeFile('./develop/db/db.json', JSON.stringify(notes));
            res.send('saved success!')
        });
})

app.get ('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});

app.get ('/', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
});


