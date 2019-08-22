import {
  ALL_SUPPORTED_VARIABLES,
  VCARD_VAR,
  CONTACT_CARD_VAR
} from 'lib/supportedVariables';
import _ from 'lodash';

const NOT_SUPPORTED_OUTSIDE_US = [VCARD_VAR, CONTACT_CARD_VAR];

//Add variables to this object to prevent their use in certain regions
export default {
  PR: ALL_SUPPORTED_VARIABLES.filter(
    variable => !_.includes(NOT_SUPPORTED_OUTSIDE_US, variable)
  ),
  AU: ALL_SUPPORTED_VARIABLES.filter(
    variable => !_.includes(NOT_SUPPORTED_OUTSIDE_US, variable)
  ),
  GB: ALL_SUPPORTED_VARIABLES.filter(
    variable => !_.includes(NOT_SUPPORTED_OUTSIDE_US, variable)
  )
};
