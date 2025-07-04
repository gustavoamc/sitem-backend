import { banUser, demoteAdmin, getAllUsers, promoteAdmin, unbanUser } from "../controllers/admin.controller"
import { checkStatus } from "../middlewares/checkStatus.middleware"

const router = require('express').Router()

router.patch('/promote/:userId', checkStatus(["root"]) , promoteAdmin)
router.patch('/demote/:userId', checkStatus(["root"]) , demoteAdmin)
router.patch('/ban/:userId', checkStatus(["root", "admin"]) , banUser)
router.patch('/unban/:userId', checkStatus(["root", "admin"]) , unbanUser)
router.get('/users', checkStatus(["root", "admin"]) , getAllUsers) //query params "role" and "isBanned"

export default router