const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router()
const UserController = require("../controllers/users")

//api endpoint to change the authority of the user
router.post("/update-Authority", auth, UserController.Authority)

module.exports = router