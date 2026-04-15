import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../validations/authValidation.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

export default router;
