const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shared: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    elements: [{ type: mongoose.Schema.Types.Mixed }],
}, { timestamps: true, collection: "canvas" });

//get all canvas if user or sharedwith user
canvasSchema.statics.getAllCanvas = async function(email) {
    try {
        // First find the user by email
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        
        if (!user) {
            return [];
        }

        // Then find all canvases where user is either owner or shared with
        const canvases = await this.find({
            $or: [
                { owner: user._id },
                { shared: user._id }
            ]
        })
        .select('name owner shared createdAt');

        return canvases;
    } catch (error) {
        console.error('Error in getAllCanvas:', error);
        throw error;
    }
};

//create canvas
canvasSchema.statics.createCanvas = async function(email, name) {
    try {
        // First find the user by email
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Create new canvas with user as owner
        const canvas = await this.create({
            name,
            owner: user._id,
            shared: [],
            elements: []
        });

        return canvas;
    } catch (error) {
        console.error('Error in createCanvas:', error);
        throw error;
    }
};

canvasSchema.statics.getCanvasById = async function(id, email) {
    try {
        // First find the user by email
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Find the canvas and populate owner information
        const canvas = await this.findOne({
            _id: id,
            $or: [
                { owner: user._id },
                { shared: user._id }
            ]
        });

        if (!canvas) {
            throw new Error('Canvas not found or access denied');
        }

        return canvas;
    } catch (error) {
        console.error('Error in getCanvasById:', error);
        throw error;
    }
};

//update canvas
canvasSchema.statics.updateCanvas = async function(id, email, elements) {
  try {
    const User = mongoose.model('User');
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the canvas exists and is accessible by the user
    const canvas = await this.findOne({
      _id: id,
      $or: [
        { owner: user._id },
        { shared: user._id }
      ]
    });

    if (!canvas) {
      throw new Error("Canvas not found or access denied");
    }

    // Update the canvas elements
    canvas.elements = elements;
    await canvas.save();

    return canvas;
  } catch (error) {
    console.error('Error in updateCanvas:', error);
    throw error;
  }
};

//add email to shared with array of canvas
canvasSchema.statics.addEmailToSharedWith = async function(canvasId, ownerEmail, sharedWithEmail) {
    try {
        // First find the owner
        const User = mongoose.model('User');
        const owner = await User.findOne({ email: ownerEmail });
        
        if (!owner) {
            throw new Error('Owner not found');
        }

        // Find the canvas and verify ownership
        const canvas = await this.findById(canvasId);
        if (!canvas) {
            throw new Error('Canvas not found');
        }

        // Verify that the requester is the owner
        if (canvas.owner.toString() !== owner._id.toString()) {
            throw new Error('Only the owner can share the canvas');
        }

        // Find the user to be shared with
        const sharedWithUser = await User.findOne({ email: sharedWithEmail });
        if (!sharedWithUser) {
            throw new Error('User to share with not found');
        }

        // Check if already shared with this user
        if (canvas.shared.includes(sharedWithUser._id)) {
            throw new Error('Canvas is already shared with this user');
        }

        // Add to shared array
        canvas.shared.push(sharedWithUser._id);
        await canvas.save();

        return canvas;
    } catch (error) {
        console.error('Error in addEmailToSharedWith:', error);
        throw error;
    }
};

//delete canvas
canvasSchema.statics.deleteCanvas = async function(id, email) {
    try {
        const User = mongoose.model('User');
        const user = await User.findOne({ email }); 

        if (!user) {
            throw new Error('User not found');
        }

        const canvas = await this.findById(id);
        if (!canvas) {
            throw new Error('Canvas not found');
        }

        if (canvas.owner.toString() !== user._id.toString()) {
            throw new Error('Only the owner can delete the canvas');
        }   

        await this.findByIdAndDelete(id);

        return true;
    } catch (error) {
        console.error('Error in deleteCanvas:', error);
        throw error;
    }   
};

const Canvas = mongoose.model("Canvas", canvasSchema);

module.exports = Canvas;