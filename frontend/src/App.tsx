import { useEffect, useState } from 'react';
import './App.css';
import { Note as NoteModel } from './models/note';
import Note from './Components/Note';
import * as NotesApi from './Network/notes.api';
import { User } from './models/user';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const val = e.target.value;
    setUser({ ...user, [name]: val });
  }

  async function loadNotes() {
    try {
      const notes = await NotesApi.fetchNotes();
      setNotes(notes);
      return notes;
    } catch (error) {
      console.log(error);
    }
  }

  const loginClick = async () => {
    const response = await NotesApi.login(user);
    setLoggedInUser(response);
    loadNotes();
  }

  const logoutClick = async () => {
    await NotesApi.logout();
    setLoggedInUser(null);
  }

  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [note, setNote] = useState({
    title: "",
    text: ""
  });
  const [editNoteId, setEditNoteId] = useState('');

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
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        //console.log(user);
        setLoggedInUser(user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLoggedInUser();
    loadNotes();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            !loggedInUser ?
              <Login user={user} loginClick={loginClick} handleUserInputChange={handleUserInputChange} />
              :
              <>
                <button type="submit" className='submit logout-submit' onClick={logoutClick}>Logout</button>
                <div className="add-note">
                  <input className='inputs add-title' type="text" value={note.title} placeholder="add title" name="title" onChange={(e) => handleInputChange(e)} />
                  <input className='inputs add-text' type="text" value={note.text} placeholder="add text (optional)" name="text" onChange={(e) => handleInputChange(e)} />
                  <button type='submit' className='submit add-submit' onClick={editNoteId !== '' ? updateNote : addNote}>{editNoteId !== '' ? "Update Note" : "Add Note"}</button>
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
              </>
          }
        />
        <Route
          path="/*"
          element={<NotFound />}
        />
      </Routes>
    </div>
  );
}

export default App;
