const express = require ("express")
const register = register("./register.js")
const login = register("./login.js")
const logout = register("./logout.js")

const router = express.Router()

router.post("/register", register )
router.post("/login", register )
router.post("/logout", register )

module.exports = router;