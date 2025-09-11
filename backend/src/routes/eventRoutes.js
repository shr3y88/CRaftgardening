import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listEvents, createEvent, getEvent, updateEvent, deleteEvent, listParticipantsForEvent } from '../controllers/eventController.js';

const router = Router();

router.get('/', listEvents);
router.post('/', authenticate, createEvent);
router.get('/:id', getEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.get('/:id/participants', authenticate, listParticipantsForEvent);

export default router;


