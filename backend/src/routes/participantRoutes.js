import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { registerParticipant, deleteParticipant } from '../controllers/participantController.js';

const router = Router();

router.post('/', registerParticipant); // public registration, user optional
router.delete('/:id', authenticate, deleteParticipant);

export default router;


