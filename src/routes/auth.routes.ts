import { registerUser, loginUser } from "../controllers/auth.controller";

const router = require('express').Router()

// "Auth" are routes that don't need authentication, like "reset password" and "register"

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router