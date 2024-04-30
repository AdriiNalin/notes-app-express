import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note } from '../types/notes'
import { hasAuthentication } from '../middleware/auth'


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

// Read - GET
// '/' return all saved notes
notesRouter.get('/', (req: Request, res: Response) => {

  // 1. Inhalte aus der Datei auslesen
  // 2. Daten zwischenspeichern und verarbeiten und vorbereiten

  const notes: Note[] = getNotes().filter(note => note.user === user)

  res.status(200).send(notes)
})

/**
 * @route GET /notes/:id - Endpoint to retrieve a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Retrieves a note by its ID belonging to the authenticated user.
 * @param {Request} req - The request object containing the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 200 OK status and the requested note if found, 
 * or a HTTP 404 Not Found if the note doesn't exist.
 */
notesRouter.get('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const note: Note | undefined = getNoteById(id)

  if (note === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
  } else {
    res.status(200).send(note)
  }

  // 4. auf Postman Anfrage senden -> überprüfen, ob alles funktioniert

})

// Update - PUT/PATCH -> TODO: Beispiel
notesRouter.put('/:id', (req: Request, res: Response) => { })

// Delete - DELETE
notesRouter.delete('/:id', (req: Request, res: Response) => { })