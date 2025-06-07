import { checkStatus } from "../middlewares/checkStatus.middleware"

const router = require('express').Router()
const { editUser, getUser } = require('../controllers/user.controller')

// "User" are routes that need authentication, like "edit user".

router.put('/edit', checkStatus(['admin', 'root', 'user']), editUser)
router.get('/', checkStatus(['admin', 'root', 'user']), getUser)

export default router