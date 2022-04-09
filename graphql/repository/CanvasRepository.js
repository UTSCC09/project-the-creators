const Canvas = require('../models/Canvas');
const dbo = require('../../db/conn');
const { frontendUrl } = require('../../constants')
const ObjectId = require('mongodb').ObjectId;

module.exports = class CanvasRepository {
    async getCanvas(creator, title, isShared) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title, isShared: isShared});
            // console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }        
    }

    async getCanvasById(id) {
        try {
            const dbConnect = dbo.getDb();
            var _idObj = ObjectId(id);
            let result = await dbConnect.collection('canvases').findOne({_id: _idObj});
            // console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }        
    }

    async getCanvases(creator, isShared, currentUser) {
        try {
            const dbConnect = dbo.getDb();
            // if (!(isShared) && currentUser != creator)
            //     throw new Error("cannot view user " + creator + "'s private gallery")
            let result = await dbConnect.collection('canvases').find({isShared: isShared, collaborators: currentUser}).toArray();
            // console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }        
    }

    async getAllCanvases(isShared, currentUser) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').find({isShared: isShared, collaborators: currentUser}).toArray();
            // console.log(result)
            return result;
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }        
    }

    async createCanvas(creator, title, isShared, currentUser) {
        try {
            if (creator !== currentUser)
                throw new Error("Cannot create canvas on another user's profile")
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title, isShared: isShared});
            // console.log(result)
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

    async updateCanvas(creator, title, thumbnail, isShared, collaborators, currentUser) {
        try {
            if (creator !== currentUser)
                throw new Error("Cannot update another user's canvas")
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title, isShared: isShared});
             console.log(result)
            if (result) {
                const updated = new Canvas(title, creator, isShared || result.isShared, thumbnail || result.thumbnail, collaborators || result.collaborators);
                const updateDoc = { $set: updated };
                result = await dbConnect.collection('canvases').updateOne({creator: creator, title: title}, updateDoc);
                const a = new Canvas(title, creator, isShared, thumbnail, collaborators);
                // console.log(a);
                // console.log(result)
                return a;
            } else {
                throw new Error("Canvas could not be found")
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }
     
    async getCollaboratorLink(id, creator, currentUser) {
        try {
            const dbConnect = dbo.getDb();
            var _idObj = ObjectId(id);
            console.log(currentUser);
            if (currentUser != creator)
                throw new Error("Can only get canvases of your own gallery");
            let result = await dbConnect.collection('canvases').findOne({_id: _idObj, creator: creator});
            console.log(result)
            if (result) {
                // Gemerate the link that will add the collabortor to the canvas
                console.log(result._id)
                const link = frontendUrl + "/canvas/" + result._id;
                console.log(link)
                return link;
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }

    async updateCanvasById(id, thumbnail) {
        try {
            const dbConnect = dbo.getDb();
            var _idObj = ObjectId(id);
            let result = await dbConnect.collection('canvases').findOne({_id: _idObj});
            // console.log(result)
            if (result) {
                result = await dbConnect.collection('canvases').update({_id: _idObj}, {$set:{thumbnailPath: thumbnail}});
                return _idObj;
            } else {
                throw new Error("Canvas could not be found")
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }
}