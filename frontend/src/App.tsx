import { useEffect, useState } from 'react';
import './App.css';
import { Note as NoteModel } from './models/note';
import Note from './Components/Note';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch('/api/notes', { method: 'GET' });
        const notes = await response.json();
        console.log(notes);
        setNotes(notes);
        return notes;
      } catch (error) {
        console.log(error);
      }
    }
    loadNotes();
  }, []);

  return (
    <div className="notes">
      <ul>
        {notes.map(note => {
          return (
            <Note note={note} key={note._id} />
          )
        })}
      </ul>
    </div>
  );
}

export default App;
