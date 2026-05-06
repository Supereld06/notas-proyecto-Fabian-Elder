
export default class NoteEntity {
    constructor(data) {
        this.title = data.title;
        this.content = data.content;
        this.imageUrl = data.imageUrl || null;
        this.isPrivate = data.isPrivate || false;
        this.password = data.password || null;
        this.userId = data.userId;
        this.categoryId = data.categoryId || null;
    }
}


