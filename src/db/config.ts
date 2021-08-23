import { Sequelize } from 'sequelize'

require('dotenv').config();

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST as string
const dbPassword = process.env.DB_PASSWORD as string

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  port: parseInt(process.env.UNIQUE_NAME_PG_PORT as string),
  logging: false
})

export default sequelizeConnection