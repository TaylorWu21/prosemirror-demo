import moment from 'moment-timezone';
import _ from 'lodash';

import supportedVariables, {
  LOCATION_VAR,
  ORGANIZATION_VAR,
  USER_VAR,
  CONTACT_VAR
} from 'lib/supportedVariables';
import { getCountry } from 'lib/phoneUtil';
import variablesSupportedRegions from 'lib/variablesSupportedRegions';

export const KNOWN_VARIABLE_COLOR = 'knownVariableColor';
export const UNKOWN_VARIABLE_COLOR = 'unknownVariableColor';
export const BACKEND_VARIABLE_COLOR = 'backendVariableColor';

export const formatTimePickerInfo = (
  timePickerInfo,
  shouldClose,
  conversationId,
  currentUser
) => {
  const senderName = `${currentUser.firstName} ${currentUser.lastName}`;
  const zone = moment.tz.zone(timePickerInfo.timeZone);
  const timeSlots = timePickerInfo.timeSlots.map(timeSlot => {
    const duration = 60 * timeSlot.interval;
    const startTime = moment(timeSlot.startTime.value, 'hh:mm A');
    const startDateTime = moment
      .tz(timeSlot.startDate.value, 'MM/DD/YYYY', timePickerInfo.timeZone)
      .set({
        hour: startTime.get('hour'),
        minute: startTime.get('minute')
      });
    return {
      startTime: startDateTime.toISOString(),
      duration: duration,
      timezoneOffset: getOffset(zone, startDateTime)
    };
  });

  return {
    conversationId: conversationId,
    title: timePickerInfo.title.value,
    timeSlots: timeSlots,
    close: shouldClose,
    senderName
  };
};

const supportedInRegion = (variable, podiumNumber) => {
  const country = getCountry(podiumNumber);
  const supportedInRegion = variablesSupportedRegions[country];
  //would rather fail permissively than restrictively for country check
  if (supportedInRegion === undefined) return true;
  return _.includes(supportedInRegion, variable);
};

export const hasUnsupportedVariables = (
  messageDraft,
  channelType,
  podiumNumber
) => {
  const missingVariables = getUnsupportedVariables(
    messageDraft,
    channelType,
    podiumNumber
  );
  return missingVariables.length > 0;
};

export const getUnsupportedVariables = (
  messageDraft,
  channelType,
  podiumNumber
) => {
  const matches = messageDraft.match(/:(\w+):/g);
  if (matches && channelType) {
    const uniqueMatches = matches.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });

    return uniqueMatches.filter(
      word =>
        !supportedInRegion(word, podiumNumber) ||
        !_.includes(supportedVariables[channelType.toUpperCase()], word)
    );
  }
  return [];
};

export const getKnownVariableInfo = (variable, props) => {
  switch (variable) {
    case LOCATION_VAR:
      return props.currentLocation.name;
    case ORGANIZATION_VAR:
      return props.currentLocation.organizationName;
    case USER_VAR:
      return props.currentUser.firstName;
    case CONTACT_VAR:
      return props.parsedContactName;
    default:
      return null;
  }
};

export const getOffset = (zone, datetime) => {
  //moment reports offsets in minutes and uses IANA's db so sign is flipped
  const minutes = zone.parse(moment.utc(datetime).valueOf());
  let offset = moment()
    .startOf('day')
    .minutes(minutes < 0 ? -minutes : minutes)
    .format('HH:mm');
  if (minutes > 0) {
    offset = `-${offset}`;
  } else {
    offset = `+${offset}`;
  }
  return offset;
};

const getNormalString = variable => {
  const words = variable
    .replace(/:/g, '')
    .split('_')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  return '(' + words.join(' ') + ')';
};

export const removeVariable = (messageDraft, variable) => {
  if (messageDraft.trim().endsWith(variable)) {
    return messageDraft.replace(RegExp(variable, 'gi'), '');
  } else {
    return messageDraft.replace(
      RegExp(variable, 'gi'),
      getNormalString(variable)
    );
  }
};
