import request from "supertest"
import app from "../../src/app"
import { Note } from "../../src/types/notes"
import { getNoteById, getNotes, addNote } from "../../src/services/data"

// Prepare mock data - an array of notes

const mockNotes: Note[] = [
    { id: 1, title: "Test Note1", content: "Note for TestUser1", user: "TestUser1" },
    { id: 2, title: "Test Note2", content: "Note for TestUser2", user: "TestUser2" },
    { id: 3, title: "Test Note3", content: "Another Note for TestUser1", user: "TestUser1" }
]

// Mock service functions
jest.mock("../../src/services/data", () => ({
  getNotes: jest.fn(() => mockNotes),
  getNoteById: jest.fn(id => mockNotes.find(note => note.id === id)),
  addNote: jest.fn()  
}))

describe("Notes routes", () => {

    test("GET /notes - retrieve all notes for authenitcated user", async () => {

        const res = await request(app)
        .get("/notes")
        .set('Authorization', 'TestUser1')
        .expect(200)

        expect(res.body).toEqual(mockNotes.filter(note => note.user === "TestUser1"))
        expect(getNotes).toHaveBeenCalled()
    })

    test("GET /notes/:id - retrieve a note by ID", async () => {

        const noteId = 1

        const res = await request(app)
        .get(`/notes/${noteId}`)
        .set('Authorization', 'TestUser1')
        .expect(200)

        expect(res.body).toEqual(mockNotes.find(note => note.id === noteId))
        expect(getNoteById).toHaveBeenCalledWith(noteId)

    })

    test("POST /notes - add a new note", async () => {

        const newNote = {
            title: "New Note Test", 
            content: "New Note Test Content", 
            user: "TestUser1"
        }

        const res = await request(app)
        .post("/notes")
        .send(newNote)
        .set('Authorization', 'TestUser1')
        .expect(204)

        expect(addNote).toHaveBeenCalledWith(newNote.title, newNote.content, newNote.user)

    })


})
