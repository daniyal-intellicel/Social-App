import {Linking, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
// import AppLink from 'react-native-app-link';

import {APPS_DATA, SOCIAL_PROFILE_TYPES, SOCIAL_MEDIA_TYPES} from '~constants';
import {handleError, extractUsernameFromURL} from './GeneralServices';

// export const openSocialMediaApp = (appType, username = '') => {
//   Linking.openURL(`${APP_URL_SCHEMES[appType]}`).catch(error =>
//     handleError(error, null, `Unable to open ${appType} app`)
//   );
// };

// export const openSocialMediaApp = async (appType, username = '') => {
//   const { appStoreId, appStoreLocale, playStoreId, url } = APPS_DATA[appType];

//   AppLink.maybeOpenURL(url, {
//     appType,
//     appStoreId,
//     appStoreLocale,
//     playStoreId,
//   })
//     .then(() => {
//       // do stuff
//     })
//     .catch(error => {
//       handleError(error, null, `Unable to open ${appType} app`);
//     });
// };

export const openSocialMediaApp = (appType, user) => {
  const data = user.socialProfiles ? user.socialProfiles[appType] : 'email';

  const emailData = user.socialProfiles
    ? user.socialProfiles[SOCIAL_PROFILE_TYPES.email]
    : {active: true, userId: user.email, verified: false};
  const {url} = APPS_DATA[appType];

  switch (appType) {
    case SOCIAL_PROFILE_TYPES.whatsapp:
      var newPerson = {
        phoneNumbers: [
          {
            label: 'mobile',
            number: data.userId,
          },
        ],
        displayName: user.name, // for android
        givenName: user.name, // for ios
      };

      if (emailData.active && emailData.userId) {
        newPerson.emailAddresses = [
          {
            label: 'social',
            email: emailData.userId,
          },
        ];
      }

      if (Platform.OS === 'ios') {
        Contacts.checkPermission().then((permission) => {
          if (permission === 'undefined') {
            Contacts.requestPermission().then((perm) => {
              if (perm === 'authorized') {
                Contacts.openContactForm(newPerson).then((err, contact) => {
                  if (err) {
                    throw err;
                  }
                  // contact has been saved
                });
              }
            });
          } else if (permission === 'authorized') {
            Contacts.openContactForm(newPerson).then((err, contact) => {
              if (err) {
                throw err;
              }
              // contact has been saved
            });
          } else {
            // other permission is denied
            // and user should allow it in settings manually
            Linking.openURL('app-settings:');
          }
        });
      } else {
        Contacts.openContactForm(newPerson).then((err, contact) => {
          if (err) {
            throw err;
          }
          // contact has been saved
        });
      }

      break;

    case SOCIAL_PROFILE_TYPES.telegram:
      var newPerson = {
        phoneNumbers: [
          {
            label: 'mobile',
            number: data.userId,
          },
        ],
        displayName: user.name, // for android
        givenName: user.name, // for ios
      };

      if (emailData.active && emailData.userId) {
        newPerson.emailAddresses = [
          {
            label: 'social',
            email: emailData.userId,
          },
        ];
      }

      if (Platform.OS === 'ios') {
        Contacts.checkPermission().then((permission) => {
          if (permission === 'undefined') {
            Contacts.requestPermission().then((perm) => {
              if (perm === 'authorized') {
                Contacts.openContactForm(newPerson).then((err, contact) => {
                  if (err) {
                    throw err;
                  }
                  // contact has been saved
                });
              }
            });
          } else if (permission === 'authorized') {
            Contacts.openContactForm(newPerson).then((err, contact) => {
              if (err) {
                throw err;
              }
              // contact has been saved
            });
          } else {
            // other permission is denied
            // and user should allow it in settings manually
            Linking.openURL('app-settings:');
          }
        });
      } else {
        Contacts.openContactForm(newPerson).then((err, contact) => {
          if (err) {
            throw err;
          }
          // contact has been saved
        });
      }

      break;

    case SOCIAL_PROFILE_TYPES.email:
      if (emailData.active && emailData.userId) {
        Linking.openURL(`mailto:${emailData.userId}`);
      }

      break;

    default: {
      let userId = data.userId.trim();

      let userUrl = userId;

      if (SOCIAL_MEDIA_TYPES.includes(appType)) {
        userId = extractUsernameFromURL(userId);

        if (
          APPS_DATA[appType].prefixView &&
          userId.charAt(0) === APPS_DATA[appType].prefixView
        ) {
          userId = userId.substring(1);
        }

        if (
          APPS_DATA[appType].prefixRequired &&
          userId.charAt(0) !== APPS_DATA[appType].prefixRequired
        ) {
          userId = APPS_DATA[appType].prefixRequired.concat(userId);
        }

        userUrl = url ? url.replace('[USERNAME]', userId) : userId;
      }

      Linking.openURL(userUrl).catch((error) =>
        handleError(error, null, 'Unable to open'),
      );
    }
  }
};
