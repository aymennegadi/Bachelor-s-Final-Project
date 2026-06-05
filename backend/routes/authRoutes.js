import express from 'express'
import { login } from '../controllers/authController.js'
import { changePassword } from '../controllers/authController.js'
import { getProfile } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.put('/change-password', changePassword)
router.get('/profile/:userId', getProfile)
export default router