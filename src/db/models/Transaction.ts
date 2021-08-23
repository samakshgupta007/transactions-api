import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'
import { Merchant, User } from './index';

interface TransactionAttributes {
  id: number;
  user_id: number;
  merchant_id: number;
  description: string;
  amount: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id'> {}

class Transaction extends Model<TransactionCreationAttributes> implements TransactionAttributes {
    public id!: number
    public user_id!: number;
    public merchant_id!: number;
    public description!: string;
    public amount!: number;
    public date!: Date;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
    },
    },
    merchant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'merchants',
            key: 'id',
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
  }, {
    timestamps: false,
    sequelize: sequelizeConnection,
    tableName: "transactions",
  })

Transaction.belongsTo(Merchant, {foreignKey: 'merchant_id'})
Transaction.belongsTo(User, {foreignKey: 'user_id'})
  
export default Transaction


