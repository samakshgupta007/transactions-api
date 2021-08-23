import { User, Merchant, Transaction } from '../db/models'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
  User.sync({ alter: isDev });
  Merchant.sync({ alter: isDev });
  Transaction.sync({ alter: isDev });
}

export default dbInit 