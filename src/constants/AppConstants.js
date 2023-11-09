export const APP_PROFILE_TYPES = {
  product: 'product',
  user: 'user',
  sponsor: 'sponsor',
};

export const PROFILE_TYPE_SYMBOLS = {
  product: '@',
  user: '+',
  sponsor: '*',
};

export const RETURN_STATUS = {
  failed: 'failed',
  success: 'success',
};

export const SEARCH_RADIUS = {
  0: {value: 0, zoom: 15},
  1: {value: 100, zoom: 15},
  2: {value: 300, zoom: 15},
  3: {value: 600, zoom: 14},
  4: {value: 1000, zoom: 14},
};

export const DEFAULT_GENERAL_SETTINGS = {
  showBothProfiles: true,
  removeLocationOnExit: false,
};

export const SEARCH_RADIUS_SURGE = 100; //In Kilometers

export const MAX_SEARCH_RADIUS = 20000; //In Kilometers

export const PEOPLE_FOUND_LIMIT = 50;

export const SPONSORS_FOUND_LIMIT = 4;

export const LOCATION_UPDATE_INTERVAL = 30000;

export const DISCOVER_PEOPLE_INTERVAL = 15000;

export const OS_TYPES = {
  ios: 'ios',
  android: 'android',
};

export const BLE_MTU_BYTE_SIZE = 512;

export const NETWORK_TYPES = {
  bluetooth: 'Bluetooth',
  internet: 'Internet',
};

export const SOCIAL_PROFILE_TYPES = {
  facebook: 'facebook',
  instagram: 'instagram',
  snapchat: 'snapchat',
  twitter: 'twitter',
  linkedin: 'linkedin',
  whatsapp: 'whatsapp',
  pinterest: 'pinterest',
  tiktok: 'tiktok',
  email: 'email',
  menu: 'menu',
  youtube: 'youtube',
  telegram: 'telegram',
  wifi: 'wifi',
  wifi_ssid: 'wifi_ssid',
};

export const IMAGE_PICKER_OPTIONS = {
  width: 250,
  height: 250,
  cropping: true,
};

export const AVAILABLE_SOCIAL_PROFILES = [
  SOCIAL_PROFILE_TYPES.facebook,
  SOCIAL_PROFILE_TYPES.instagram,
  SOCIAL_PROFILE_TYPES.snapchat,
  SOCIAL_PROFILE_TYPES.twitter,
  SOCIAL_PROFILE_TYPES.linkedin,
  SOCIAL_PROFILE_TYPES.tiktok,
  SOCIAL_PROFILE_TYPES.whatsapp,
  SOCIAL_PROFILE_TYPES.email,
  SOCIAL_PROFILE_TYPES.youtube,
  SOCIAL_PROFILE_TYPES.wifi,
  SOCIAL_PROFILE_TYPES.wifi_ssid,
  SOCIAL_PROFILE_TYPES.pinterest,
  SOCIAL_PROFILE_TYPES.menu,
  SOCIAL_PROFILE_TYPES.telegram,
];

export const SOCIAL_MEDIA_TYPES = [
  SOCIAL_PROFILE_TYPES.facebook,
  SOCIAL_PROFILE_TYPES.instagram,
  SOCIAL_PROFILE_TYPES.snapchat,
  SOCIAL_PROFILE_TYPES.twitter,
  // SOCIAL_PROFILE_TYPES.linkedin,
  SOCIAL_PROFILE_TYPES.pinterest,
  SOCIAL_PROFILE_TYPES.tiktok,
  SOCIAL_PROFILE_TYPES.youtube,
  SOCIAL_PROFILE_TYPES.telegram,
];

export const APPS_DATA = {
  [SOCIAL_PROFILE_TYPES.wifi]: {
    placeholder: 'Wi-Fi Name',
  },
  [SOCIAL_PROFILE_TYPES.wifi_ssid]: {
    placeholder: 'Wi-Fi Password',
  },
  [SOCIAL_PROFILE_TYPES.menu]: {
    placeholder: 'Digital Menu',
  },
  [SOCIAL_PROFILE_TYPES.facebook]: {
    url: 'https://www.facebook.com/[USERNAME]',
    placeholder: 'Facebook.com/yourname',
    appUrl: 'fb://',
    playStoreId: 'com.facebook.katana',
    appStoreId: '284882215',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.instagram]: {
    url: 'https://www.instagram.com/[USERNAME]',
    placeholder: 'Instagram.com/username',
    appUrl: 'instagram://app',
    playStoreId: 'com.instagram.android',
    appStoreId: '389801252',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.snapchat]: {
    url: 'https://www.snapchat.com/add/[USERNAME]',
    placeholder: 'Snapchat username',
    appUrl: 'snapchat://',
    playStoreId: 'com.snapchat.android',
    appStoreId: '447188370',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.twitter]: {
    url: 'https://twitter.com/[USERNAME]',
    placeholder: 'Twitter.com/username',
    appUrl: 'twitter://',
    playStoreId: 'com.twitter.android',
    appStoreId: '333903271',
    appStoreLocale: 'us',
    prefixView: '@',
  },
  [SOCIAL_PROFILE_TYPES.linkedin]: {
    url: 'https://www.linkedin.com/in/[USERNAME]',
    placeholder: 'LinkedIn full profile URL',
    appUrl: 'linkedin://',
    playStoreId: 'com.linkedin.android',
    appStoreId: '288429040',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.pinterest]: {
    url: 'https://www.pinterest.com/[USERNAME]',
    placeholder: 'Pinterest.com/username',
    appUrl: 'pinterest://app',
    playStoreId: 'com.pinterest',
    appStoreId: '429047995',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.email]: {
    url: 'mailto:[USERNAME]',
    placeholder: 'Email address',
  },
  [SOCIAL_PROFILE_TYPES.whatsapp]: {
    placeholder: 'Phone number',
    appUrl: 'whatsapp://',
    playStoreId: 'com.whatsapp',
    appStoreId: '310633997',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.tiktok]: {
    url: 'https://www.tiktok.com/[USERNAME]',
    placeholder: 'TikTok @id',
    appUrl: 'tiktok://',
    playStoreId: 'com.zhiliaoapp.musically',
    appStoreId: '835599320',
    appStoreLocale: 'us',
    prefixRequired: '@',
  },
  [SOCIAL_PROFILE_TYPES.youtube]: {
    url: 'https://www.youtube.com/c/[USERNAME]',
    placeholder: 'Youtube Channel',
    appUrl: 'youtube://',
    playStoreId: 'com.google.android.youtube',
    appStoreId: '544007664',
    appStoreLocale: 'us',
  },
  [SOCIAL_PROFILE_TYPES.telegram]: {
    placeholder: 'Phone number',
    appUrl: 'telegram://',
    playStoreId: 'org.telegram.messenge',
    appStoreId: '686449807',
    appStoreLocale: 'us',
  },
};

export const SOCIAL_PROFILES_USER_INIT = {
  [SOCIAL_PROFILE_TYPES.facebook]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.instagram]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.snapchat]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.twitter]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.linkedin]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.pinterest]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.whatsapp]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.telegram]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.tiktok]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.youtube]: {
    userId: '',
    active: false,
    verified: false,
  },
  [SOCIAL_PROFILE_TYPES.email]: {userId: '', active: false, verified: false},
};

export const SOCIAL_PROFILES_PRODUCT_INIT = {
  [SOCIAL_PROFILE_TYPES.wifi]: {userId: '', active: false, verified: true},
  [SOCIAL_PROFILE_TYPES.wifi_ssid]: {
    userId: '',
    active: false,
    verified: true,
  },
  [SOCIAL_PROFILE_TYPES.menu]: {userId: '', active: false, verified: true},
  ...SOCIAL_PROFILES_USER_INIT,
};

export const ANALYTICS_DATA_INIT = {
  opened: {},
  viewed: {},
  searched: {},
};

export const BLE_DATA_TRANSMIT_CHARACTERISTICS = {
  uid1: 'bea99000-0000-0000-0000-000000000000',
  uid2: 'bea99000-1000-0000-0000-000000000000',
  activeProfileType: 'bea99000-2000-0000-0000-000000000000',
  os: 'bea99001-0000-0000-0000-000000000000',
  name: 'bea99002-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.facebook]: 'bea99003-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.instagram]: 'bea99004-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.snapchat]: 'bea99005-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.twitter]: 'bea99006-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.linkedin]: 'bea99007-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.pinterest]: 'bea99008-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.whatsapp]: 'bea99009-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.email]: 'bea99010-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.wifi]: 'bea99011-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.wifi_ssid]: 'bea99012-0000-0000-0000-000000000000',
  chat: 'bea99013-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.tiktok]: 'bea99014-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.youtube]: 'bea99015-0000-0000-0000-000000000000',
  [SOCIAL_PROFILE_TYPES.telegram]: 'bea99016-0000-0000-0000-000000000000',
};

export const BLE_CHAR_TYPES = {
  read: 'Read',
  write: 'Write',
};

export const BLE_DATA_TRANSMIT_SERVICE = 'bea99000-0000-0000-0000-000000000000';

export const ERROR_MESSAGES = {
  internet: 'Unable to connect to internet.',
  bluetooth: 'Bluetooth not available.',
  location: 'Unable to retreive device location.',
  generic: 'BeApp is not responding properly.',
  updateProfile: 'BeApp is not responding properly.',
  messageSend: 'Message sending failed',
  imageUpload: 'Image select failed, try again.',
};

export const PROMPT_CATEGORIES = {
  snackbar: 'snackbar',
  toast: 'toast',
};

export const LOADING_TYPES = {
  halt: 'halt',
  flow: 'flow',
};

export const REPORT_TYPES = {
  other: 'other',
  spam: 'spam',
  inappropriate: 'inappropriate',
};

export const DEFAULT_LOCATION = {
  latitude: 49.26018,
  longitude: -123.121948,
};

export const ALERT_MESSAGES = {
  REPORT_USER: {
    title: 'Report User',
    messages: {
      other: {
        message:
          'Are you sure you want to report this user for abuse or inappropriate content?',
        already: 'You have already reported this user.',
      },
      spam: {
        message: 'Are you sure you want to report this user for spam?',
        already: 'You have already reported this user for spam.',
      },
      inappropriate: {
        message:
          'Are you sure you want to report this user for inappropriate content?',
        already:
          'You have already reported this user for inappropriate content.',
      },
    },
  },
  BLOCK_USER: {
    title: 'Block user',
    message: 'Are you sure you want to block this user.',
  },
  NO_AVATAR: {
    message:
      'TIP: You will not be discoverable until you set your profile image',
  },
  UPDATE_APP: {
    title: 'Update Available',
    message:
      'There is a newer version of this app available, please update to continue.',
  },
};

export const EULA_URL = 'https://blog.beapp.co/eula/';
export const PRIVACY_POLICY_URL = 'https://blog.beapp.co/privacy-policy/';

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const DIRECTION = [
  {
    id: 1,
    name: 'Hotel to Airport',
  },
  {id: 2, name: 'Airport to Hotel'},
];

export const PRICING_TYPE = {
  perPerson: 1,
  perVehicle: 2,
};
export const VEHICLE_CAPACITY = ['1-3', '4-7'];
export const PAYMENT_METHODS = {
  cash: 1,
  card: 2,
};

export const TOUR_TYPES = [
  {id: 0, name: 'all', label: 'All'},
  {id: 1, name: 'shared', label: 'Shared'},
  {id: 2, name: 'ticket', label: 'Ticket'},
  {id: 3, name: 'ticket_guide', label: 'Ticket+Guide'},
];
