import { Sequelize } from 'sequelize-typescript';
import { Car } from '../models/car.model';

const sequelize = new Sequelize({
  database: 'car_rental',
  dialect: 'mysql',
  username: 'root',
  password: '',
  host: 'localhost',
  models: [Car],
});

export default sequelize;