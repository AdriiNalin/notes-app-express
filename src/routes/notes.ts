import { Request, Response, Router } from 'express'
import * as fs from 'node:fs'
// const fs = require('fs')
import { getNotes } from '../services/data'
import { Note } from '../types/notes'


export const notesRouter = Router()

// CRUD - Create Read Update Delete
// PUT/PATCH, POST, GET, DELETE

// Create - POST
notesRouter.post('/', (req: Request, res: Response) => {

  // 1. Daten aus der Anfrage auslesen
  // Wir erwarten, dass wir Informationen zum title, content, user
  // Warum erwarten wir keine ID? Eine ID liegt in unserer Verantwortung

  // const { title, content, user } = req.body

  const title = req.body.title
  const content = req.body.content
  const user = req.body.user

  // 2. Daten möchten wir an unsere Datei anhängen
  // Merke: ID selber festlegen

  // 2.1 alte Daten abfragen
  const oldNotes = getNotes()
  const id = oldNotes.length + 1 // keine saubere Lösung, aber reicht aus

  // 2.2 neue Notiz erstellen
  const newNote: Note = {
    title: title,
    content: content,
    user: user,
    id: id
  }

  oldNotes.push(newNote)

  // 2.3 neue Notiz in Datei hinzufügen

  const newNotes = { notes: oldNotes }
  fs.writeFileSync('data/notes.json', JSON.stringify(newNotes))

  // 3. Rückmeldung geben, ob alles funktioniert hat

  res.send(204)
})

// Funktion zum Lesen von Notizen aus der Datei
function readNotesFromFile(): Note[] {
  const data = fs.readFileSync('data/notes.json', 'utf-8');
  return JSON.parse(data).notes;
}

// Funktion zum Schreiben von Notizen in die Datei
function writeNotesToFile(notes: Note[]) {
  const newNotes = { notes: notes };
  fs.writeFileSync('data/notes.json', JSON.stringify(newNotes));
}


// Read - GET
// '/' return all saved notes
notesRouter.get('/', (req: Request, res: Response) => {

  // 1. Inhalte aus der Datei auslesen
  // 2. Daten zwischenspeichern und verarbeiten und vorbereiten

  const notes = getNotes()

  // 3. Inhalte ausliefern

  res.status(200).send(notes)

  // 4. auf Postman Anfrage senden -> überprüfen, ob alles funktioniert

})

// '/:id' return only one result
notesRouter.get('/:id', (req: Request, res: Response) => {

  const id = parseInt(req.params.id)

  // 1. Inhalte aus der Datei auslesen
  // 2. Daten zwischenspeichern und verarbeiten und vorbereiten

  const notes = getNotes() // Liste von Notizen

  // nur die Notiz finden, die die verlangte ID hat

  const note = notes.find(note => note.id === id)
  // console.log(note)

  // 3. Inhalte ausliefern

  if (note === undefined) {
    // wenn wir keine passende Notiz gefunden haben
    res.status(404).send(`Note with ID ${id} was not found.`)
  } else {
    // notiz gefunden
    res.status(200).send(note)
  }

  // 4. auf Postman Anfrage senden -> überprüfen, ob alles funktioniert

})

// Update - PUT/PATCH -> TODO: Beispiel
// Update - PATCH
notesRouter.patch('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body; // Die aktualisierten Daten aus der Anfrage

  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);

  if (noteIndex === -1) {
    res.status(404).send(`Note with ID ${id} was not found.`);
  } else {
    // Die vorhandene Notiz mit den aktualisierten Daten aktualisieren
    notes[noteIndex] = { ...notes[noteIndex], ...updatedData };

    // Die aktualisierten Notizen in die Datei speichern
    const newNotes = { notes: notes };
    fs.writeFileSync('data/notes.json', JSON.stringify(newNotes));

    res.status(200).send(`Note with ID ${id} has been updated.`);
  }
});

// Delete - DELETE
notesRouter.delete('/:id', (req: Request, res: Response) => { })