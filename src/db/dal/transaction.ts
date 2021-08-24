import { QueryTypes } from 'sequelize'
import moment from 'moment'
import { Transaction } from '../models'
import { UserIdDto } from '../dto/user-id.dto'
import { dateCheck } from './utils'
import sequelizeConnection from '../config'

export const getMerchantDataByUserId = async ({ userId, from, to } : UserIdDto) => {    
    const userExists = await Transaction.findOne({ where: { user_id: userId } })
        .then(function(data) { return data !== null });
    if(!userExists) return {
        error: `No data found for this user`,
      };

    //@ts-ignore
    const { error } = dateCheck(from, to);
    if(error) return {
        error
    };

    const userTransactions = await sequelizeConnection.query(
            `SELECT * from (SELECT "Transaction"."user_id", PERCENT_RANK() OVER(PARTITION BY merchant_id ORDER BY SUM(amount) ASC) AS "Percentile", "merchants"."display_name" 
            FROM "transactions" AS "Transaction" LEFT OUTER JOIN "merchants" ON "Transaction"."merchant_id" = "merchants"."id" WHERE "Transaction"."date" BETWEEN 
            '${moment(from).format('YYYY-MM-DD HH:mm:ss')}' AND '${moment(to).format('YYYY-MM-DD HH:mm:ss')}' GROUP BY "Transaction"."user_id", "Transaction"."merchant_id", 
            "merchants"."id", "merchants"."display_name") AS SUBQUERY WHERE user_id = ${userId};`,
    { type: QueryTypes.SELECT })
    .then(function(results) {
        return results;
    }).catch((err: any) => {
        console.log('Error:', err);
    });

    return userTransactions || [];

    // TODO: Having clause is changing the data in the percentile field - not filtering it as we need it to and returning incorrect values.
    // FIXME: Currently executing it as a raw sql query using sequelize.
    // const where = {
    //     date: {
    //         [Op.between]: [from, to]
    //     }
    // };
    // await Transaction.findAll({ 
    //     raw: true,
    //     where,
    //     attributes: [
    //         'user_id',
    //         [Sequelize.literal(`PERCENT_RANK() OVER(PARTITION BY merchant_id ORDER BY SUM(amount) ASC)`), 'Percentile'],
    //     ],
    //     include:[
    //         { model: Merchant, attributes: [ 'id', 'display_name' ] },
    //     ],
    //     group: ['Transaction.user_id', 'Transaction.merchant_id', 'Merchant.id', 'Merchant.display_name'],
    //     having: Sequelize.literal(`user_id = ${userId}`)
    // }).then(function(data) {
    //     console.log('got it now', data);
    // });
}