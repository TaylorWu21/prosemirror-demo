export const APPLE_PAY_VAR = ':payment:';
export const AUTHENTICATE_VAR = ':authenticate:';
export const CONTACT_CARD_VAR = ':contact_card:';
export const CONTACT_VAR = ':contact:';
export const FEEDBACK_VAR = ':feedback:';
export const LIST_PICKER_VAR = ':list_picker:';
export const LOCATION_VAR = ':location:';
export const ORGANIZATION_VAR = ':organization:';
export const PACKAGE_DELIVERY_VAR = ':package_delivery:';
export const REVIEW_INVITATION_EN_VAR = ':review_invitation_en:';
export const REVIEW_INVITATION_ES_VAR = ':review_invitation_es:';
export const REVIEW_INVITATION_FR_VAR = ':review_invitation_fr:';
export const REVIEW_INVITATION_VAR = ':review_invitation:';
export const TIME_PICKER_VAR = ':time_picker:';
export const USER_VAR = ':user:';
export const VCARD_VAR = ':vcard:';

export const VARIABLE_HUMAN_NAMES = {
  [APPLE_PAY_VAR]: 'Apple Pay',
  [AUTHENTICATE_VAR]: 'Authenticate',
  [CONTACT_CARD_VAR]: 'Contact Card',
  [CONTACT_VAR]: 'Contact',
  [FEEDBACK_VAR]: 'Feedback',
  [LIST_PICKER_VAR]: 'List Picker',
  [LOCATION_VAR]: 'Location',
  [ORGANIZATION_VAR]: 'Organization',
  [PACKAGE_DELIVERY_VAR]: 'Package Delivery',
  [REVIEW_INVITATION_EN_VAR]: 'Review Invitation - EN', // TODO: Why do we have EN and a normal Review_Invitation one too?
  [REVIEW_INVITATION_ES_VAR]: 'Review Invitation - ES',
  [REVIEW_INVITATION_FR_VAR]: 'Review Invitation - FR',
  [REVIEW_INVITATION_VAR]: 'Review Invitation',
  [TIME_PICKER_VAR]: 'Time Picker',
  [USER_VAR]: 'User',
  [VCARD_VAR]: 'V-Card'
};

export const ALL_SUPPORTED_VARIABLES = [
  APPLE_PAY_VAR,
  AUTHENTICATE_VAR,
  CONTACT_CARD_VAR,
  CONTACT_VAR,
  FEEDBACK_VAR,
  LIST_PICKER_VAR,
  LOCATION_VAR,
  ORGANIZATION_VAR,
  PACKAGE_DELIVERY_VAR,
  REVIEW_INVITATION_EN_VAR,
  REVIEW_INVITATION_ES_VAR,
  REVIEW_INVITATION_FR_VAR,
  REVIEW_INVITATION_VAR,
  TIME_PICKER_VAR,
  USER_VAR,
  VCARD_VAR
];

export const REVIEW_VARIABLES = [
  REVIEW_INVITATION_EN_VAR,
  REVIEW_INVITATION_ES_VAR,
  REVIEW_INVITATION_FR_VAR,
  REVIEW_INVITATION_VAR
];

export const TEMPLATE_SELECTOR_VARIABLES = [
  CONTACT_VAR,
  CONTACT_CARD_VAR,
  LOCATION_VAR,
  ORGANIZATION_VAR,
  REVIEW_INVITATION_VAR,
  USER_VAR
];
export const MODAL_VARIABLES = [
  APPLE_PAY_VAR,
  LIST_PICKER_VAR,
  PACKAGE_DELIVERY_VAR,
  TIME_PICKER_VAR
];

export const COMMON_CHANNEL_VARS = [
  CONTACT_VAR,
  LOCATION_VAR,
  ORGANIZATION_VAR,
  FEEDBACK_VAR,
  REVIEW_INVITATION_EN_VAR,
  REVIEW_INVITATION_ES_VAR,
  REVIEW_INVITATION_FR_VAR,
  REVIEW_INVITATION_VAR,
  USER_VAR
];

export const BACKEND_CONVERTED_VARIABLES = [
  ...REVIEW_VARIABLES,
  VCARD_VAR,
  CONTACT_CARD_VAR,
  FEEDBACK_VAR
];

export default {
  APPLE: [
    ...COMMON_CHANNEL_VARS,
    APPLE_PAY_VAR,
    AUTHENTICATE_VAR,
    LIST_PICKER_VAR,
    PACKAGE_DELIVERY_VAR,
    TIME_PICKER_VAR
  ],
  EMAIL: [...COMMON_CHANNEL_VARS],
  FACEBOOK: [...COMMON_CHANNEL_VARS],
  GOOGLE: [...COMMON_CHANNEL_VARS],
  PHONE: [...COMMON_CHANNEL_VARS, VCARD_VAR, CONTACT_CARD_VAR]
};
