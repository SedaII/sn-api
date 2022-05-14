const express = require("express");
const postController = require("../controllers/post");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const router = express.Router();


router.get("/", auth, postController.getAllPosts);
router.post("/", auth, multer, postController.create);

router.delete("/:id", auth, postController.delete);

module.exports = router;