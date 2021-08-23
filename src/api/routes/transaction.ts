import { Router, Request, Response } from 'express'
import moment from 'moment'
import * as transactionController from '../controllers/transaction'

const transactionsRouter = Router()

transactionsRouter.get('/:userId', async (req: Request, res: Response) => {
    const userId = Number(req.params.userId)
    let { from, to } = req.query as any;
    if (!from) from = moment().subtract(1, 'months').toDate();
    if (!to) to = moment().toDate();
    const result = await transactionController.getMerchantDataByUserId({ userId, from, to})
    if (result.error) return res.status(400).send(result.error);
    return res.status(200).send(result)
})

export default transactionsRouter
