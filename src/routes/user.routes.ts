import { checkStatus } from "../middlewares/checkStatus.middleware"
import { editUser, getUser, changePassword } from '../controllers/user.controller'

const router = require('express').Router()

// "User" are routes that need authentication, like "edit user".

router.put('/edit', checkStatus(['admin', 'root', 'user']), editUser)
router.get('/', checkStatus(['admin', 'root', 'user']), getUser)
router.put('/change-password', checkStatus(['admin', 'root', 'user']), changePassword)

export default router