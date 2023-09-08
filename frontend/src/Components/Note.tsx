import { Note as NoteModel } from "../models/note";

interface NoteProps {
    note: NoteModel,
}

const Note = ({ note }: NoteProps) => {
    const {
        title,
        text,
        // createdAt,
        // updatedAt
    } = note;
    return (
        <li className="note">
            <h2>{title}</h2>
            <p>{text}</p>
        </li>
    );
}

export default Note;