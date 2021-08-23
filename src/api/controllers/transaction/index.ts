import * as service from '../../../db/services/transactionService'
import { UserIdDto } from '../../../db/dto/user-id.dto'

export const getMerchantDataByUserId = async (userIdDto: UserIdDto) => {
    return service.getMerchantDataByUserId(userIdDto);
}