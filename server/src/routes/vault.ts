import express from 'express';
import { 
  createEntry, 
  getEntries, 
  getEntry, 
  updateEntry, 
  deleteEntry,
  getEmergencyEntries 
} from '../controllers/vaultController';
import { auth, checkTrustedContact } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.post('/', auth, createEntry);
router.get('/', auth, getEntries);
router.get('/:id', auth, getEntry);
router.put('/:id', auth, updateEntry);
router.delete('/:id', auth, deleteEntry);

// Emergency access routes
router.get('/emergency/entries', auth, checkTrustedContact, getEmergencyEntries);

export default router; 