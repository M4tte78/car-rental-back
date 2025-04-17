import { Router } from 'express';
import { carController } from '../controllers/car.controller';
import { upload } from '../middleware/upload.middleware';
import cors from 'cors';
import { sendReservationEmail } from '../config/email';

const router = Router();

// Enable CORS for all Car routes
router.use(cors());

router.get('/', carController.getAllCars);
router.get('/available', carController.getAvailableCars);
router.get('/search', carController.searchCars);
router.get('/:id', carController.getCarById);
router.post('/', upload.single('photo'), carController.createCar);
router.put('/:id', upload.single('photo'), carController.updateCar);
router.delete('/:id', carController.deleteCar);
router.post('/:id/like', carController.likeCar);
router.put('/:id/cancel-reservation', carController.cancelReservation);

router.get('/test-email', async (req, res) => {
    try {
      await sendReservationEmail('baillymatteo@icloud.com', {
        brand: 'Ferrari',
        model: '458',
        reservedFrom: new Date(),
        reservedTo: new Date(),
        customerName: 'Mattéo'
      });
      res.json({ message: 'Email envoyé' });
    } catch (err) {
      res.status(500).json({ error: 'Erreur envoi email', details: err });
    }
  });
  


export default router;