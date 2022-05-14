const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

const router = express.Router();


router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.delete("/delete-account", auth, userController.deleteAccount);

router.get("/profil", auth, userController.getProfil);

router.put("/profil", auth, userController.updateProfil);

module.exports = router;