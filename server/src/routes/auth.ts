import { Router } from 'express';
import { register, login, updateTrustedContact, requestEmergencyAccess } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/emergency-access', auth, requestEmergencyAccess);

// Protected routes
router.post('/trusted-contact', auth, updateTrustedContact);

export default router; 