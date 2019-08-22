import _ from 'lodash';
import {
  KNOWN_VARIABLE_COLOR,
  UNKOWN_VARIABLE_COLOR,
  BACKEND_VARIABLE_COLOR
} from 'lib/MessageComposerUtils';

import { VARIABLE_HUMAN_NAMES } from 'lib/supportedVariables';

export const CONTACT_BLOT_NAME = 'contact';

export const getVariableBlot = ({
  blotText,
  color,
  display,
  name,
  onClick
}) => ({
  variable: {
    blotText,
    color,
    display,
    name,
    onClick: onClick || _.noop,
    messenger: true
  }
});

export const getContactBlot = (variable, contactName, onClick) => {
  if (!contactName)
    return getVariableBlot({
      blotText: variable,
      color: UNKOWN_VARIABLE_COLOR,
      display: VARIABLE_HUMAN_NAMES[variable],
      name: CONTACT_BLOT_NAME,
      onClick
    });

  return getVariableBlot({
    blotText: contactName,
    color: KNOWN_VARIABLE_COLOR,
    display: contactName,
    name: CONTACT_BLOT_NAME
  });
};

export const getBackendSupportedBlot = (variable, name) =>
  getVariableBlot({
    name,
    blotText: variable,
    color: BACKEND_VARIABLE_COLOR,
    display: VARIABLE_HUMAN_NAMES[variable]
  });

export const getKnownVariableBlot = (variableInfo, name) =>
  getVariableBlot({
    name,
    blotText: variableInfo,
    color: KNOWN_VARIABLE_COLOR,
    display: variableInfo
  });

export const getUnknownVariableBlot = (variable, name, onClick) =>
  getVariableBlot({
    name,
    onClick,
    blotText: variable,
    display: variable.replace(/:/gi, ''),
    color: UNKOWN_VARIABLE_COLOR
  });
