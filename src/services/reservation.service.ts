import { Reservation } from '../models/reservation.model';

export class ReservationService {
  async findAllByCarId(carId: number) {
    return Reservation.findAll({
      where: { carId },
      order: [['reservedFrom', 'ASC']],
    });
  }

  async create(data: any) {
    return Reservation.create(data);
  }

  // Tu pourras ajouter d'autres méthodes plus tard (delete, update, etc.)
}

export const reservationService = new ReservationService();
