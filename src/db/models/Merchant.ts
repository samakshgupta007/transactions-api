import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'
import { Transaction } from './index'

interface MerchantAttributes {
  id: number;
  display_name: string;
  icon_url: string;
  funny_gif_url: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface MerchantCreationAttributes extends Optional<MerchantAttributes, 'id'> {}

class Merchant extends Model<MerchantCreationAttributes> implements MerchantAttributes {
    public id!: number
    public display_name!: string;
    public icon_url!: string;
    public funny_gif_url!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Merchant.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    funny_gif_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
  }, {
    timestamps: false,
    sequelize: sequelizeConnection,
    tableName: "merchants",
  })
  
export default Merchant

