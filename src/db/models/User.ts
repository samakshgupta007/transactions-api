import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'
import { Transaction } from './index';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserCreationAttributes> implements UserAttributes {
    public id!: number
    public first_name!: string;
    public last_name!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
  }, {
    timestamps: false,
    sequelize: sequelizeConnection,
    tableName: "users",
  })
  
export default User
