export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res) => {
        try {
            const data = req.body;

            if (req.file) {
                data.imageUrl = "/uploads/" + req.file.filename;
            }

            data.userId = req.user.id;

            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    getNotesByUserId = async (req, res) => {
        try {
            const notes = await this.noteService.getNotesByUserId(req.user.id);
            res.status(200).json(notes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };

    updateNote = async (req, res) => {
        try {
            const data = req.body;

            if (req.file) {
                data.imageUrl = "/uploads/" + req.file.filename;
            }

            const note = await this.noteService.updateNote(req.params.id, data);
            res.status(200).json(note);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };

    deleteNote = async (req, res) => {
        try {
            const result = await this.noteService.deleteNote(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };

    shareNote = async (req, res) => {
        try {
            const { email } = req.body;
            const result = await this.noteService.shareNoteByEmail(
                req.params.id,
                email,
                req.user.id
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    //  EJERCICIO 3
    getPublicNote = async (req, res) => {
        try {
            const note = await this.noteService.getById(req.params.id);

            if (!note) {
                return res.status(404).json({ message: "Nota no encontrada" });
            }

            if (note.isPrivate) {
                return res.status(403).json({ message: "Nota privada" });
            }

            res.json(note);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}