const Canvas = require('../models/Canvas');
const dbo = require('../../db/conn');

module.exports = class CanvasRepository {
    async createCanvas(title, creator, isShared) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('canvases').findOne({creator: creator, title: title});
            console.log(result)
            if (!result) {
                const canvasDoc = new Canvas(title, creator, isShared);
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
}