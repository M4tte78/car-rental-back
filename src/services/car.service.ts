import { Car } from '../models/car.model';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export class CarService {
  async findAll(): Promise<Car[]> {
    return Car.findAll();
  }

  async findById(id: number): Promise<Car | null> {
    return Car.findByPk(id);
  }

  async findAvailable(): Promise<Car[]> {
    return Car.findAll({
      where: {
        available: false
      }
    });
  }

  async create(carData: Partial<Car>): Promise<Car> {
    return Car.create(carData);
  }

  async update(id: number, carData: Partial<Car>): Promise<[number, Car[]]> {
    const [affectedCount, affectedRows] = await Car.update(carData, {
      where: { id },
      returning: true,
    });
    return [affectedCount, affectedRows];
  }

  async delete(id: number): Promise<number> {
    return Car.destroy({
      where: { id },
    });
  }

  async incrementLikes(id: number): Promise<[number, Car[]]> {
    return Car.update(
      { likes: sequelize.literal('likes + 1') },
      { where: { id }, returning: true }
    );
  }

  async searchByBrandOrModel(query: string): Promise<Car[]> {
    return Car.findAll({
      where: {
        [Op.or]: [
          { brand: { [Op.like]: `%${query}%` } },
          { model: { [Op.like]: `%${query}%` } }
        ]
      }
    });
  }
}

export const carService = new CarService();