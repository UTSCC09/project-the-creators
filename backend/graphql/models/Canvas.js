module.exports = class Canvas {
    constructor(title, creator, isShared) {
        const date = new Date();
        this.title = title; 
        this.creator = creator;
        this.path = '';
        this.isShared = isShared;
        this.collaborators = [creator];
        this.date = date.toUTCString();
    }
}