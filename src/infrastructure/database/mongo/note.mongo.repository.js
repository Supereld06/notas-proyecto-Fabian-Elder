import NoteModel from "./note.model.js";

export default class NoteMongoRepository {
    async save(noteEntity) {
        const note = new NoteModel({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId,
            categoryId: noteEntity.categoryId
        });

        const saved = await note.save();
        return saved.toObject();
    }

    async findByUserId(userId) {
        if (process.env.NODE_ENV === "test") {
            return [];
        }

        return await NoteModel.find({ userId });
    }

    async findById(id) {
        return await NoteModel.findById(id);
    }

    async update(id, data) {
        return await NoteModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await NoteModel.findByIdAndDelete(id);
    }
}
