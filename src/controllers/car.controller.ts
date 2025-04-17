import { Request, Response } from 'express';
import { carService } from '../services/car.service';
import { sendReservationEmail } from '../config/email';

export class CarController {
  async getAllCars(req: Request, res: Response) {
    try {
      const cars = await carService.findAll();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cars', error });
    }
  }

  async getAvailableCars(req: Request, res: Response) {
    try {
      const cars = await carService.findAvailable();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available cars', error });
    }
  }

  async getCarById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide (NaN)' });
    }

    try {
      const car = await carService.findById(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching car', error });
    }
  }

  async createCar(req: Request, res: Response) {
    try {
      const carData = {
        ...req.body,
        photo: req.file ? `/${req.file.filename}` : null,
      };
      const car = await carService.create(carData);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ message: 'Error creating car', error });
    }
  }

  async updateCar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide (NaN)' });
    }

    try {
      const carData = {
        ...req.body,
        photo: req.file ? `/${req.file.filename}` : undefined,
        available: req.body.available === 'false' ? false : true, 
      };
      

      const car = await carService.findById(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      const isReservation =
        carData.available === false &&
        carData.reservedFrom &&
        carData.reservedTo &&
        carData.customerEmail &&
        carData.customerName;

      if (isReservation) {
        const [affectedCount] = await carService.update(id, {
          ...carData,
          available: false
        });

        if (affectedCount === 0) {
          return res.status(404).json({ message: 'Car not found during reservation update' });
        }

        console.log('📧 Envoi email à :', carData.customerEmail);
        await sendReservationEmail(carData.customerEmail, {
          brand: car.brand,
          model: car.model,
          reservedFrom: new Date(carData.reservedFrom),
          reservedTo: new Date(carData.reservedTo),
          customerName: carData.customerName
        });
        console.log('✅ Email envoyé à :', carData.customerEmail);

        return res.json({ message: 'Réservation enregistrée avec succès' });
      }

      const [affectedCount] = await carService.update(id, carData);
      if (affectedCount === 0) {
        return res.status(404).json({ message: 'Car not found during update' });
      }

      const updatedCar = await carService.findById(id);
      res.json(updatedCar);
    } catch (error) {
      console.error('❌ Erreur updateCar :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la voiture', error });
    }
  }

  async deleteCar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    try {
      const deleted = await carService.delete(id);
      if (deleted === 0) {
        return res.status(404).json({ message: 'Car not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting car', error });
    }
  }

  async likeCar(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    try {
      const [affectedCount] = await carService.incrementLikes(id);
      if (affectedCount === 0) {
        return res.status(404).json({ message: 'Car not found' });
      }
      const updatedCar = await carService.findById(id);
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ message: 'Error liking car', error });
    }
  }

  async searchCars(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      const cars = await carService.searchByBrandOrModel(query);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: 'Error searching cars', error });
    }
  }

  async cancelReservation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    try {
      const car = await carService.findById(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }

      const [updated] = await carService.update(id, {
        available: true,
        reservedFrom: undefined,
        reservedTo: undefined,
        customerName: undefined,
        customerEmail: undefined
      });

      if (updated === 0) {
        return res.status(400).json({ message: 'Failed to cancel reservation' });
      }

      res.json({ message: 'Réservation annulée avec succès' });
    } catch (error) {
      console.error('❌ Erreur annulation réservation :', error);
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  }
}

export const carController = new CarController();
