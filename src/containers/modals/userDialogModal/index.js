import React from 'react';
import {
  View,
  Image,
  // StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import Icons from 'react-native-vector-icons/Entypo';
import Clipboard from '@react-native-clipboard/clipboard';
import {RootSiblingParent} from 'react-native-root-siblings';

import {Colors} from '../../../styles';
import {Button, Text} from '../../../components/common';
import {profilePublicIcons} from '../../../constants/userData';
import SocialIconCard from '../../cards/socialIconCard';
import {deleteFromContacts, addToContacts} from '~redux/actions';
import {openSocialMediaApp} from '~utils/services/AppLinkingServices';
import {
  showToast,
  extractUsernameFromURL,
} from '~utils/services/GeneralServices';
import {
  APP_PROFILE_TYPES,
  PROFILE_TYPE_SYMBOLS,
  SOCIAL_PROFILE_TYPES,
  // REPORT_TYPES,
  // ALERT_MESSAGES,
  SOCIAL_MEDIA_TYPES,
  // AVAILABLE_SOCIAL_PROFILES,
} from '~constants';
import {useTheme} from '~styles/ThemeProvider';

function UserDialogModal({
  visible = false,
  onClose,
  data,
  navigation,
  profileData,
  // deleteFromContacts,
  // addToContacts,
}) {
  const {colors} = useTheme();

  // const Wrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;
  const Wrapper = RootSiblingParent;
  const user = {...data};
  // console.log('user', user);
  const {product: prdSymb, user: usrSymb} = PROFILE_TYPE_SYMBOLS;

  const cuid =
    user.activeProfileType === APP_PROFILE_TYPES.product
      ? `${prdSymb}${user.uid}`
      : `${usrSymb}${user.uid}`;

  const doesExistInContacts =
    profileData.contacts && profileData.contacts[cuid];

  const handleContactUpdate = () => {
    doesExistInContacts ? deleteFromContacts(cuid) : addToContacts(cuid);
  };

  const renderItem = (item, index) => {
    const type = item.icon;
    let smData = item;

    const userId = SOCIAL_MEDIA_TYPES.includes(type)
      ? extractUsernameFromURL(smData.userId)
      : smData.userId;

    smData.userId = userId;

    const callBack = (socialProfile) => {
      switch (socialProfile.icon) {
        case SOCIAL_PROFILE_TYPES.wifi:
          Clipboard.setString(user.socialProfiles.wifi_ssid.userId);
          showToast('Wi-Fi Password Copied');
          break;
        case SOCIAL_PROFILE_TYPES.menu:
          Linking.openURL(`http://${user.socialProfiles.menu.userId}`);
          break;

        default:
          openSocialMediaApp(type, user);
          break;
      }
    };

    const onLongPress = (socialProfile) => {
      Clipboard.setString(`${socialProfile.userId}`);
      showToast('Copied to Clipboard');
    };

    return item.active ? (
      <SocialIconCard
        item={smData}
        key={index}
        typeStyle={4}
        socialProfileData={item}
        iconType={
          type === 'wifi' || type === 'wifi_ssid' || type === 'menu' ? 2 : 1
        }
        callBack={callBack}
        onLongPress={onLongPress}
      />
    ) : null;
  };

  let selectedProfileIcon = [];

  profilePublicIcons.forEach((item, index) => {
    if (user && user.socialProfiles && user.socialProfiles[item.icon]) {
      if (user.socialProfiles[item.icon].userId !== '') {
        let object = {...user.socialProfiles[item.icon], ...item};
        selectedProfileIcon.push(object);
      }
    }
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Wrapper>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback
            onPress={() => {
              onClose();
            }}>
            <View needsOffscreenAlphaCompositing style={{height: 150}} />
          </TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
              elevation: 8,
              paddingBottom: 20,
              backgroundColor: colors.modal,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.modal,
                paddingHorizontal: 15,
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
              }}>
              {data ? (
                <View style={{alignItems: 'center', paddingTop: 20}}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate('UserInfoScreen', {user: user});
                      onClose();
                    }}>
                    <Image
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 25,
                      }}
                      source={
                        data.avatar
                          ? {uri: data.avatar}
                          : require('../../../assets/images/profileDefault.png')
                      }
                    />
                  </Pressable>
                  <Text h3 bold style={{marginTop: 5}} color={colors.text}>
                    {data.name}
                  </Text>
                  <Text color={colors.dusItemStatus}>{data.status}</Text>
                </View>
              ) : null}
              {selectedProfileIcon.map((item, index) => {
                return renderItem(item, index);
              })}
              {user.activeProfileType !== APP_PROFILE_TYPES.sponsor ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                  }}>
                  <View style={{marginRight: 5, width: '48%'}}>
                    <Button
                      h4
                      buttonType={'secondary'}
                      buttonTextColor={
                        doesExistInContacts ? Colors.orange[0] : ''
                      }
                      onPress={handleContactUpdate}>
                      {doesExistInContacts
                        ? 'Remove Contact'
                        : 'Add to Contact'}
                    </Button>
                  </View>
                  <View style={{width: '48%'}}>
                    <Button
                      h4
                      onPress={() => {
                        navigation.navigate('MessageScreen', {user: user});
                        onClose();
                      }}>
                      Send Message
                    </Button>
                  </View>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={{
                  position: 'absolute',
                  right: 30,
                  top: 20,
                }}>
                <Icons name="cross" size={25} color={Colors.grey[3]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    </Modal>
  );
}

// const styles = StyleSheet.create({
//   inputContainerStyle: {
//     height: 50,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderBottomWidth: 1,
//     backgroundColor: Colors.grey[5],
//   },
// });

const mapStateToProps = (state) => {
  const {profileData} = state.profile;

  return {
    profileData,
  };
};

export default connect(mapStateToProps, {deleteFromContacts, addToContacts})(
  UserDialogModal,
);
