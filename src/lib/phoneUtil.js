import _ from 'lodash';
import { parsePhoneNumber } from 'libphonenumber-js';

export const getCountry = _.memoize(phone => {
  if (!phone) return 'US';
  try {
    return parsePhoneNumber(phone).country;
  } catch (e) {
    return 'US';
  }
});