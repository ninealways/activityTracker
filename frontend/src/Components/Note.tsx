import { formatDate } from "../Utils/formatDate";
import { Note as NoteModel } from "../models/note";

interface NoteProps {
    note: NoteModel,
}

const Note = ({ note }: NoteProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note;
    return (
        <div className="note">
            <h2>{title}</h2>
            <p>{text}</p>
            <hr />
            <h5 className="center">Created At: {formatDate(createdAt)} | Updated At: {formatDate(updatedAt)} </h5>
        </div>
    );
}

export default Note;