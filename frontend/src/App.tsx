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

  const addNote = async() => {
    try {
      const addednote = await NotesApi.createNote(note);
      console.log(addednote);
      setNote({
        title: "",
        text: ""
      });
      await loadNotes();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="app">
      <div className='add-note'>
        <input className='add-title' type="text" value={note.title} placeholder="add title" name="title" onChange={(e) => handleInputChange(e)} />
        <input className='add-text' type="text" value={note.text} placeholder="add text (optional)" name="text" onChange={(e) => handleInputChange(e)} />
        <button type='submit' className='add-submit' onClick={addNote}>Add Note </button>
      </div>
      <div className="notes">
        {notes.map(note => {
          return (
            <Note note={note} key={note._id} />
          )
        })}
      </div>
    </div>
  );
}

export default App;
