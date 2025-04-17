import { DataTypes } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'cars',
  timestamps: true,
})
export class Car extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  brand!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photo!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  likes!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  available!: boolean;

  @Column({
    type: DataTypes.DATE,
    allowNull: true
  })
  reservedFrom!: Date | null;
  

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reservedTo!: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerName!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerEmail!: string | null;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}