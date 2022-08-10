const express = require ("express")
const register = require("./register.js")
const login = require("./login.js")
const logout = require("./logout.js")

const router = express.Router()

router.post("/register", register )
router.post("/login", register )
router.post("/logout", register )

module.exports = router;