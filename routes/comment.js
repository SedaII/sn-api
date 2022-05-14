const express = require("express");
const commentController = require("../controllers/comment");
const auth = require("../middlewares/auth");

const router = express.Router();


router.get("/:id", auth, commentController.getCommentsByPost);
router.post("/", auth,commentController.create);

router.delete("/:id", auth, commentController.delete);

module.exports = router;