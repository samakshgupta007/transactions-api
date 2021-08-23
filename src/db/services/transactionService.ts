import * as transactionDal from '../dal/transaction';
import { UserIdDto } from '../dto/user-id.dto';

export const getMerchantDataByUserId = (userIdDto: UserIdDto ) => {
    return transactionDal.getMerchantDataByUserId(userIdDto)
}