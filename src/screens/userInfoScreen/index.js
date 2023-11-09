import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import ImageView from 'react-native-image-viewing';
import Clipboard from '@react-native-clipboard/clipboard';

import {Colors} from '../../styles';
import {Dialog, Text} from '../../components/common';
import {profilePublicIcons} from '../../constants/userData';
import ScreenContainer from '../../components/ScreenContainer';
import HeaderOptions from '../../helpers/HeaderOptions';
import {Images} from '~assets';
import {openSocialMediaApp} from '~utils/services/AppLinkingServices';
import {
  ALERT_MESSAGES,
  REPORT_TYPES,
  SOCIAL_MEDIA_TYPES,
  SOCIAL_PROFILE_TYPES,
} from '~constants';
import {
  showToast,
  extractUsernameFromURL,
} from '~utils/services/GeneralServices';
import SocialItem from './SocialItem';
import {useTheme} from '~styles/ThemeProvider';

export default (props) => {
  const {colors} = useTheme();

  const user = props.route.params.user;

  const databaseRef = database().ref();

  const [dialogVisible, setdialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={4}
          title={user.name}
          typeData={user}
        />
      ),
    });
  }, []);

  const imageVisibleHandler = () => {
    setImageVisible(!imageVisible);
  };

  const imageHandler = ({uri}) => {
    if (uri) {
      setImages([
        {
          uri,
        },
      ]);

      imageVisibleHandler();
    }
  };

  const dialogHandler = ({type, status, initial}) => {
    const reportType = REPORT_TYPES.other;
    const {currentUser} = auth();
    if (type === 'reportUser' && initial) {
      setDialogData({
        title: ALERT_MESSAGES.REPORT_USER.messages[reportType].message,
        type,
      });
      setdialogVisible(!dialogVisible);
    } else if (type === 'reportUser' && status === 'true') {
      databaseRef
        .child(`reportedUsers/${user.uid}/${currentUser.uid}/${reportType}`)
        .once('value', (snap) => {
          console.log('snap', snap);
          if (snap.val()) {
            Alert.alert(
              ALERT_MESSAGES.REPORT_USER.messages[reportType].already,
            );
          } else {
            databaseRef
              .child(
                `reportedUsers/${user.uid}/${currentUser.uid}/${reportType}`,
              )
              .set(Date.now())
              .then(() => showToast('This user has been reported to admin'));
          }
        });

      setdialogVisible(!dialogVisible);
    }

    if (type === 'blockContact' && initial) {
      setDialogData({
        title: ALERT_MESSAGES.BLOCK_USER.message,
        type,
      });
      setdialogVisible(!dialogVisible);
    } else if (type === 'blockContact' && status === 'true') {
      const promiseBlockedByUser = databaseRef
        .child(`users/${currentUser.uid}/blocked`)
        .update({[user.uid]: true});

      const promiseBlockedUser = databaseRef
        .child(`users/${user.uid}/blockedBy`)
        .update({[currentUser.uid]: true});

      Promise.all([promiseBlockedByUser, promiseBlockedUser]).then(() => {
        props.navigation.goBack();
        showToast(`${user.name} has been blocked`);
      });
      setdialogVisible(!dialogVisible);
    }

    // if (type === 'clearChat' && initial) {
    //   setDialogData({
    //     title: 'Would you like to delete this conversation?',
    //     type,
    //   });
    //   setdialogVisible(!dialogVisible);
    // } else if (type === 'clearChat' && status === 'true') {
    //   setdialogVisible(!dialogVisible);
    // }

    if (status === 'false') {
      setdialogVisible(!dialogVisible);
    }
  };

  const renderItem = (item, index) => {
    const type = item.icon;
    let data = item;

    const userId = SOCIAL_MEDIA_TYPES.includes(type)
      ? extractUsernameFromURL(data.userId)
      : data.userId;

    data.userId = userId;

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
      Clipboard.setString(socialProfile.userId);
      showToast('Copied to Clipboard');
    };

    return (
      <SocialItem
        item={data}
        user={user}
        key={index}
        callBack={callBack}
        onLongPress={onLongPress}
        typeStyle={4}
        iconType={
          type === 'wifi' || type === 'wifi_ssid' || type === 'menu' ? 2 : 1
        }
        socialProfileData={item}
      />
    );
  };

  const {inputContainerStyle} = styles;
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
    <ScreenContainer style={{backgroundColor: colors.background}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{flex: 1, backgroundColor: colors.background, paddingTop: 20}}>
          <View style={{alignItems: 'center'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                imageHandler({uri: user.avatar ? user.avatar : null});
              }}>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 25,
                }}
                source={user.avatar ? {uri: user.avatar} : Images.no_image}
              />
            </TouchableWithoutFeedback>
            <Text h3 bold style={{marginTop: 5}} color={colors.text}>
              {user.name}
            </Text>
            <Text color={colors.dusItemStatus}>{user.status}</Text>
          </View>
          <View
            style={{
              backgroundColor: colors.modal,
              marginTop: 30,
              paddingHorizontal: 10,
            }}>
            {selectedProfileIcon.map((item, index) => {
              return renderItem(item, index);
            })}
          </View>
          <View
            style={{
              marginTop: 10,
              backgroundColor: colors.modal,
            }}>
            {/* <TouchableOpacity
              onPress={() => {
                dialogHandler({type: 'clearChat', initial: true});
              }}>
              <View style={inputContainerStyle}>
                <Text h4 color={Colors.orange[0]}>
                  Clear Chat
                </Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                dialogHandler({type: 'reportUser', initial: true});
              }}
              style={{backgroundColor: colors.modal}}>
              <View
                style={[
                  inputContainerStyle,
                  {borderBottomColor: colors.divider},
                ]}>
                <Text h4 color={Colors.orange[0]}>
                  Report User
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dialogHandler({type: 'blockContact', initial: true});
              }}
              style={{backgroundColor: colors.modal}}>
              <View
                style={[
                  inputContainerStyle,
                  {borderBottomColor: colors.divider},
                ]}>
                <Text h4 color={Colors.orange[0]}>
                  Block Contact
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Dialog
        onRequestClose={dialogHandler}
        isVisible={dialogVisible}
        data={dialogData}
      />
      <ImageView
        images={images}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => imageVisibleHandler()}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  inputContainerStyle: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[8],
    padding: 4,
    paddingVertical: 6,
    justifyContent: 'center',
  },
});
