import { Op, Sequelize } from 'sequelize'
import { Transaction, Merchant } from '../models'
import { UserIdDto } from '../dto/user-id.dto'
import { dateCheck } from './utils';

export const getMerchantDataByUserId = async ({ userId, from, to } : UserIdDto) => {
    const updatedArr = [] as any;
    const where = {
        date: {
            [Op.between]: [from, to]
        }
    };
    
    const userExists = await Transaction.findOne({ where: { user_id: userId } })
        .then(function(data) { return data !== null });
    if(!userExists) return {
        error: `User not found`,
      };

    //@ts-ignore
    const { error } = dateCheck(from, to);
    if(error) return {
        error
    }; 

    await Transaction.findAll({ 
        raw: true,
        where,
        include:[
            { model: Merchant, attributes: [ 'id', 'display_name' ] },
        ],
        group: ['Transaction.user_id', 'Transaction.merchant_id', 'Merchant.id', 'Merchant.display_name'],
        attributes: [
            'user_id',
            [Sequelize.literal(`PERCENT_RANK() OVER(PARTITION BY merchant_id ORDER BY SUM(amount) ASC)`), 'Percentile'],
        ],
    }).then(function(data) {
        data.forEach(el => {
            if(el.user_id == userId){
                updatedArr.push(el);
            }
        })
    });
    return updatedArr
}