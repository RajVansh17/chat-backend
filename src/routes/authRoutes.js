import express from 'express'
import { register, login, me } from '../controllers/authController.js'
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();


router.post('/signup', register);
router.post('/login', login);
router.get('/me',authenticateToken,me);

export default router;
