import { registerUser, loginUser } from "../controllers/auth.controller";

const router = require('express').Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router