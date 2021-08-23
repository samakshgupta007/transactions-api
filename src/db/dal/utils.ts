import moment from 'moment';

export const dateCheck = (from: Date, to: Date ) => {
    const diffDays = moment(to).diff(moment(from), 'days');
    if (diffDays < 0) {
      return {
        error: `'to' Date cannot before 'from' date`,
      }
    }
    return true;
};