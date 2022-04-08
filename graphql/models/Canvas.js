module.exports = class Canvas {
    constructor(title, creator, isShared, thumbnailPath, collaborators) {
        const date = new Date();
        this.title = title; 
        this.creator = creator;
        this.isShared = isShared;
        this.thumbnailPath = thumbnailPath;
        this.collaborators = collaborators;
        this.creationDate = date.toUTCString();
    }
}