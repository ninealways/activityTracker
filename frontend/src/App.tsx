import { useEffect, useState } from 'react';
import './App.css';
import { Note as NoteModel } from './models/note';
import Note from './Components/Note';
import * as NotesApi from './Network/notes.api';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [note, setNote] = useState({
    title: "",
    text: ""
  });
  const [editNoteId, setEditNoteId] = useState('');

  async function loadNotes() {
    try {
      const notes = await NotesApi.fetchNotes();
      setNotes(notes);
      return notes;
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const val = e.target.value;
    setNote({ ...note, [name]: val });
  }

  const addNote = async () => {
    if (note.title === "") return false;
    try {
      await NotesApi.createNote(note);
      setNote({
        title: "",
        text: ""
      });
      await loadNotes();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteNote = async (note: NoteModel) => {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(n => { return n._id !== note._id }))
    } catch (error) {
      console.log(error)
    }
  }

  const editNote = async (note: NoteModel) => {
    setNote({ title: note.title, text: note?.text || "" });
    setEditNoteId(note._id);
  }

  const updateNote = async () => {
    try {
      await NotesApi.updatedNote(editNoteId, note);
      await loadNotes();
      setNote({
        title: "",
        text: ""
      });
      setEditNoteId('');
    } catch (error) {
      console.log(error)
    }
  }

  const cancelEdit = () => {
    setNote({
      title: "",
      text: ""
    });
    setEditNoteId('');
  }
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="app">
      <div className='add-note'>
        <input className='add-title' type="text" value={note.title} placeholder="add title" name="title" onChange={(e) => handleInputChange(e)} />
        <input className='add-text' type="text" value={note.text} placeholder="add text (optional)" name="text" onChange={(e) => handleInputChange(e)} />
        <button type='submit' className='add-submit' onClick={editNoteId !== '' ? updateNote : addNote}>{editNoteId !== '' ? "Update Note" : "Add Note"}</button>
        {editNoteId !== '' ? <button className='cancel-button' onClick={cancelEdit}>Cancel</button> : ""}
      </div>
      <div className="notes">
        {notes.map(note => {
          return (
            <Note
              note={note}
              onDeleteNoteClicked={deleteNote}
              onEditNoteClicked={editNote}
              key={note._id}
            />
          )
        })}
      </div>
    </div>
  );
}

export default App;
