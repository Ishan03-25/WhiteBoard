const Canvas = require("../models/canvasSchema");

const getAllCanvas = async (req, res) => {
    const { email } = req.user;
    try {
        const canvas = await Canvas.getAllCanvas(email);
        res.status(200).json(canvas);
    }
    catch (error) {
        console.error('Get all canvas error:', error);
        res.status(500).json({ message: error.message });
    }
}

const getCanvasById = async (req, res) => {
    const { id } = req.params;
    const { email } = req.user;
    

    try {
        if (!id) {
            return res.status(400).json({ message: 'Canvas ID is required' });
        }

        const canvas = await Canvas.getCanvasById(id, email);
        
        if (!canvas) {
            return res.status(404).json({ message: 'Canvas not found' });
        }

        res.status(200).json(canvas);
    }
    catch (error) {
        console.error('Get canvas by id error:', error);
        res.status(500).json({ message: error.message });
    }
}

const createCanvas = async (req, res) => {
    try {
        const { email } = req.user;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Canvas name is required' });
        }

        const canvas = await Canvas.createCanvas(email, name);
        res.status(201).json(canvas);
    }
    catch (error) {
        console.error('Create canvas error:', error);
        res.status(500).json({ message: error.message });
    }
}

//update canvas
const updateCanvas = async (req, res) => {
    const { id } = req.params;
    const { email } = req.user;
    const { elements } = req.body;

    try {
        const canvas = await Canvas.updateCanvas(id, email, elements);
        res.status(200).json(canvas);
    }
    catch (error) {
        console.error('Update canvas error:', error);
        res.status(500).json({ message: error.message });
    }
}

//add email to shared with array of canvas
const addEmailToSharedWith = async (req, res) => {
    const { id } = req.params;
    const { email } = req.user;
    const { sharedWithEmail } = req.body;

    try {
        const canvas = await Canvas.addEmailToSharedWith(id, email, sharedWithEmail);
        res.status(200).json(canvas);
    }
    catch (error) {
        console.error('Add email to shared with error:', error);
        res.status(500).json({ message: error.message });
    }
}

//delete canvas
const deleteCanvas = async (req, res) => {
    const { id } = req.params;
    const { email } = req.user;

    try {
        const result = await Canvas.deleteCanvas(id, email);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Delete canvas error:', error);
        res.status(500).json({ message: error.message });
    }
}                       

module.exports = { getAllCanvas, createCanvas, getCanvasById, updateCanvas, addEmailToSharedWith, deleteCanvas };
