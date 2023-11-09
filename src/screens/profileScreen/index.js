import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Switch} from 'react-native-paper';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from '../../styles';
import {Dialog, Text, Icon} from '../../components/common';
import {
  profileIcons,
  productProfileIcons,
  defaultData,
} from '../../constants/userData';
import SocialIconCard from '../../containers/cards/socialIconCard';
import ScreenContainer from '../../components/ScreenContainer';
import HeaderOptions from '../../helpers/HeaderOptions';
import {
  APP_PROFILE_TYPES,
  SOCIAL_PROFILE_TYPES,
  SOCIAL_PROFILES_PRODUCT_INIT,
  AVAILABLE_SOCIAL_PROFILES,
  IMAGE_PICKER_OPTIONS,
  ERROR_MESSAGES,
} from '~constants';
import {
  updateName,
  updateStatus,
  updateSocialProfiles,
  updateAvatar,
  switchProfile,
} from '~redux/actions';
import {Images} from '~assets';
import {handleError} from '~utils/services/GeneralServices';
import themeContext from '~components/ThemeContext';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    const {socialProfiles} = props.profileData;
    const socialProfileStates = {};

    AVAILABLE_SOCIAL_PROFILES.forEach((type) => {
      socialProfileStates[type] =
        socialProfiles[type] || SOCIAL_PROFILES_PRODUCT_INIT[type];
    });

    this.state = {
      avatarPath: null,
      thumbPath: null,
      imageSelect: false,
      dialogVisible: false,
      dialogVisible1: false,
      ...socialProfileStates,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={4}
          title="Profile"
        />
      ),
    });
  }

  onToggleSwitch = (value) => {
    this.props.switchProfile(
      value ? APP_PROFILE_TYPES.product : APP_PROFILE_TYPES.user,
    );
  };

  dialogHandler = ({status}) => {
    // const {avatarPath, thumbPath} = this.state;
    // status === true
    //   ? avatarPath && this.props.updateAvatar(avatarPath, thumbPath)
    //   : null;
    this.setState({
      dialogVisible: !this.state.dialogVisible,
    });
  };

  dialogHandler1 = ({status, obj}) => {
    if (status === true) {
      this.props.updateName(obj.name.trim());
      this.props.updateStatus(obj.status);
    }

    this.setState({
      dialogVisible1: !this.state.dialogVisible1,
    });
  };

  callBack = (item) => {
    this.props.navigation.navigate('VerifySocialScreen', {
      item,
      inputValue: this.props.profileData.socialProfiles[item.icon]
        ? this.props.profileData.socialProfiles[item.icon].userId
        : '',
      switchValue: this.props.profileData.socialProfiles[item.icon]
        ? this.props.profileData.socialProfiles[item.icon].active
        : false,
      type: SOCIAL_PROFILE_TYPES[item.icon],
      wifi: this.props.profileData.socialProfiles.wifi
        ? this.props.profileData.socialProfiles.wifi.userId
        : '',
      password: this.props.profileData.socialProfiles.wifi_ssid
        ? this.props.profileData.socialProfiles.wifi_ssid.userId
        : '',
      wifiCheck: SOCIAL_PROFILE_TYPES[item.icon] === 'wifi' ? true : false,
    });
  };

  openPickerHandler = () => {
    ImagePicker.openPicker(IMAGE_PICKER_OPTIONS).then((image) => {
      this.processSelectedImage(image);
    });
  };

  openCameraHandler = () => {
    ImagePicker.openCamera(IMAGE_PICKER_OPTIONS).then((image) => {
      this.processSelectedImage(image);
    });
  };

  processSelectedImage = (image) => {
    ImageResizer.createResizedImage(image.path, 250, 250, 'JPEG', 70, 0, null)
      .then((thumbnail) => {
        this.props.updateAvatar(image.path, thumbnail.path);
        this.setState({
          avatarPath: image.path,
          thumbPath: thumbnail.path,
        });
      })
      .catch((error) => {
        handleError('ImagePicker Error: ', error, ERROR_MESSAGES.imageUpload);
      });
  };

  renderItem = (item, index) => {
    // console.log('item', item);
    return (
      <SocialIconCard
        type={SOCIAL_PROFILE_TYPES[item.icon]}
        socialProfileData={
          this.props.profileData.socialProfiles[item.icon]
            ? this.props.profileData.socialProfiles[item.icon]
            : defaultData
        }
        item={item}
        typeStyle={2}
        callBack={this.callBack}
        key={index}
      />
    );
  };

  renderProductItem = (item, index) => {
    return item.icon !== 'wifi_ssid' ? (
      <SocialIconCard
        type={SOCIAL_PROFILE_TYPES[item.icon]}
        socialProfileData={
          this.props.profileData.socialProfiles[item.icon]
            ? this.props.profileData.socialProfiles[item.icon]
            : defaultData
        }
        item={item}
        typeStyle={2}
        iconType={2}
        callBack={this.callBack}
        key={index}
      />
    ) : null;
  };

  render() {
    const {profileData, activeProfileType} = this.props;
    const {avatarPath, dialogVisible, dialogVisible1} = this.state;

    const avatarSource = avatarPath
      ? {uri: avatarPath}
      : profileData.avatar
      ? {uri: profileData.avatar}
      : Images.no_image;

    const {colors} = this.props.useThemeHook;

    return (
      <ScreenContainer>
        <SafeAreaView
          style={{
            justifyContent: 'space-between',
            backgroundColor: colors.background,
          }}
          edges={['bottom']}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.containerStyle}>
              <View style={{alignItems: 'center'}}>
                <View>
                  <Image
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 25,
                    }}
                    source={avatarSource}
                  />
                  <TouchableOpacity
                    onPress={() => this.dialogHandler({status: false})}>
                    <View
                      style={{
                        position: 'absolute',
                        right: -5,
                        bottom: -5,
                        backgroundColor: Colors.light,
                        padding: 8,
                        borderRadius: 50,
                      }}>
                      <Icon
                        name={'camera'}
                        fill={Colors.dark}
                        height="18"
                        width="18"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => this.dialogHandler1({status: false})}>
                  <Text h3 bold style={{marginTop: 5}} color={colors.text}>
                    {profileData.name ? profileData.name : ''}
                  </Text>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() => this.dialogHandler1({status: false})}>
                  <Text color={colors.text}>
                    {profileData.status ? profileData.status : ''}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  backgroundColor: colors.modal,
                  marginTop: 30,
                  paddingHorizontal: 10,
                }}>
                {activeProfileType === APP_PROFILE_TYPES.product ? (
                  <View>
                    {productProfileIcons.map((item, index) => {
                      return this.renderProductItem(item, index);
                    })}
                  </View>
                ) : null}
                {profileIcons.map((item, index) => {
                  return this.renderItem(item, index);
                })}
              </View>
              {/* <View
              style={{
                backgroundColor: Colors.light,
                paddingHorizontal: 10,
                marginVertical: 10,
              }}>
              <SocialIconCard
                item={{icon: 'phoneNumber', label: 'Phone Number'}}
                type={2}
                verified={true}
              />
            </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: 60,
                  backgroundColor: colors.modal,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}>
                <Text h4 color={colors.text}>
                  Switch to Business Profile
                </Text>
                <Switch
                  value={activeProfileType === APP_PROFILE_TYPES.product}
                  onValueChange={this.onToggleSwitch}
                />
              </View>
            </View>
          </ScrollView>
          <Dialog
            buttons={[
              {
                label: 'Select a photo from gallery',
                onPress: () => {
                  this.openPickerHandler();
                },
              },
              {
                label: 'Take a photo from Camera',
                onPress: () => {
                  this.openCameraHandler();
                },
              },
            ]}
            onRequestClose={this.dialogHandler}
            isVisible={dialogVisible}
            dialogType={2}
          />
          <Dialog
            buttons={[
              {
                type: 'name',
                value: profileData.name,
                placeholder: 'Enter your Name',
              },
              {
                type: 'status',
                value: profileData.status,
                placeholder: 'Enter your Status',
              },
            ]}
            onRequestClose={this.dialogHandler1}
            isVisible={dialogVisible1}
            dialogType={3}
          />
        </SafeAreaView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // backgroundColor: Colors.grey[8],
    paddingTop: 20,
  },
  inputContainerStyle: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[8],
    padding: 4,
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  const {profileData, activeProfileType} = state.profile;
  return {
    profileData,
    activeProfileType,
  };
};

export default connect(mapStateToProps, {
  updateName,
  updateStatus,
  updateSocialProfiles,
  updateAvatar,
  switchProfile,
})(themeContext(ProfileScreen));
