const { getAllCanvas, createCanvas, getCanvasById, updateCanvas, addEmailToSharedWith, deleteCanvas } = require("../controller/canvasController");
const auth = require("../middleware/auth");

const router = require("express").Router();

// Protected routes - require authentication
router.get("/", auth, getAllCanvas);
router.post("/", auth, createCanvas);
router.get("/:id", auth, getCanvasById);
router.put("/:id", auth, updateCanvas);
router.put("/:id/share", auth, addEmailToSharedWith);
router.delete("/:id", auth, deleteCanvas);
module.exports = router; 