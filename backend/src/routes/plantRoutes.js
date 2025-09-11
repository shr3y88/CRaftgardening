import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listPlants, createPlant, getPlant, updatePlant, deletePlant } from '../controllers/plantController.js';

const router = Router();

router.get('/', listPlants);
router.post('/', authenticate, createPlant);
router.get('/:id', getPlant);
router.put('/:id', authenticate, updatePlant);
router.delete('/:id', authenticate, deletePlant);

export default router;


