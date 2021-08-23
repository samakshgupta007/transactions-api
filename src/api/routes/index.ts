import { Router } from 'express'
import transactionsRouter from './transaction'

const router = Router()

router.use('/transactions', transactionsRouter)

export default router