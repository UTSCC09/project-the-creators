const Canvas = require('../models/Canvas');
const dbo = require('../../db/conn');
const { baseUrl } = require('../../constants')

module.exports = class CanvasRepository {
    async getCanvases(creator, isShared, currentUser) {
        try {
            const dbConnect = dbo.getDb();
            if (!(isShared) && currentUser != creator)
                throw new Error("cannot view user " + creator + "'s private gallery")
            let result = await dbConnect.collection('canvases').find({creator: creator, isShared: isShared, collaborators: currentUser}).toArray();
            console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }        
    }

    async createCanvas(creator, title, isShared) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title});
            console.log(result)
            if (!result) {
                const canvasDoc = new Canvas(title, creator, isShared, '', [creator]);
                result = await dbConnect.collection('canvases').insertOne(canvasDoc);
                return canvasDoc;
            } else {
                throw new Error("Canvas with that name already exists")
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }

    async updateCanvas(creator, title, thumbnail, isShared, collaborators) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title});
            console.log(result)
            if (result) {
                const updated = new Canvas(title, creator, isShared || result.isShared, thumbnail || result.thumbnail, collaborators || result.collaborators);
                const updateDoc = { $set: updated };
                result = await dbConnect.collection('canvases').updateOne({creator: creator, title: title}, updateDoc);
                const a = new Canvas(title, creator, isShared, thumbnail, collaborators);
                console.log(a);
                console.log(result)
                return a;
            } else {
                throw new Error("Canvas could not be found")
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }
     
    async getCollaboratorLink(creator, title, currentUser) {
        try {
            const dbConnect = dbo.getDb();
            if (currentUser != creator)
                throw new Error("Can only get canvases of your own gallery");
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title});
            console.log(result)
            if (result) {
                // Gemerate the link that will add the collabortor to the canvas
                const link = baseUrl + "/" + result.id;
                console.log(link)
                return link;
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }
}