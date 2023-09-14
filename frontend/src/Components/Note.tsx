import { formatDate } from "../Utils/formatDate";
import { Note as NoteModel } from "../models/note";

interface NoteProps {
    note: NoteModel,
    onDeleteNoteClicked: (note: NoteModel) => void,
    onEditNoteClicked: (note: NoteModel) => void,
}

const Note = ({ note, onDeleteNoteClicked, onEditNoteClicked }: NoteProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note;
    return (
        <div className="note">
            <div className="delete-icon"
                onClick={(e) => {
                    onDeleteNoteClicked(note)
                    e.stopPropagation();
                }}
            >X</div>
            <div className="edit-icon"
                onClick={(e) => {
                    onEditNoteClicked(note)
                    e.stopPropagation();
                }}
            >i</div>
            <h2>{title}</h2>
            <p>{text}</p>
            <hr />
            <h5 className="center">Created At: {formatDate(createdAt)} | Updated At: {formatDate(updatedAt)} </h5>
        </div>
    );
}

export default Note;