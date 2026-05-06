import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
    }

    async createNote(data) {
        if (!data.title || !data.content) {
            throw new Error("Title and content are required");
        }

        const noteData = {
            ...data,
            categoryId: data.categoryId || null
        };

        const note = new NoteEntity(noteData);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId) {
        return await this.noteRepository.findByUserId(userId);
    }

    async updateNote(id, data) {
        const note = await this.noteRepository.update(id, data);
        if (!note) throw new Error("Note not found");
        return note;
    }

    async deleteNote(id) {
        const note = await this.noteRepository.delete(id);
        if (!note) throw new Error("Note not found");
        return { message: "Note deleted successfully" };
    }

    async getById(id) {
        return await this.noteRepository.findById(id);
    }

    async shareNoteByEmail(noteId, email, userId) {
        const note = await this.noteRepository.findById(noteId);
        if (!note) throw new Error("Note not found");

        if (note.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await this.mailService.sendNoteEmail(email, note);
    }
}