import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
};

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCred {
    username: string,
    email: string,
    password: string,
}

export async function signUp(cred: SignUpCred): Promise<User> {
    const response = await fetchData("api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cred)
    });
    return response.json();
}

export interface LoginCred {
    email: string,
    password: string,
}

export async function login(cred: LoginCred): Promise<User> {
    const response = await fetchData("api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cred)
    });
    return response.json();
}

export async function logout() {
    await fetchData("api/users/logout", { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData('/api/notes', { method: 'GET' });
    return response.json();
};

export interface NoteInput {
    title: string,
    text?: string,
}
export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes", {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(note),
    })
    return response.json();
}

export async function deleteNote(noteId: string) {
    await fetchData("/api/notes/" + noteId, { method: "DELETE" });
}

export async function updatedNote(noteId: string, note: NoteInput) {
    await fetchData("/api/notes/" + noteId, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(note),
    });
}