import React, {useEffect, useState} from 'react';
import {TextInput, View, Image, Alert} from 'react-native';
import {connect} from 'react-redux';
import Icons from 'react-native-vector-icons/Ionicons';
import {Switch} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Button, Text} from '../../components/common';
import {generateIcon, generateSVG} from '../../helpers';
import GlobalStyles, {Colors} from '../../styles';
import HeaderOptions from '../../helpers/HeaderOptions';
import {APPS_DATA} from '~constants';
import {updateSocialProfiles} from '~redux/actions';
import {
  APP_PROFILE_TYPES,
  SOCIAL_PROFILE_TYPES,
  SOCIAL_PROFILES_PRODUCT_INIT,
  AVAILABLE_SOCIAL_PROFILES,
  // ERROR_MESSAGES,
} from '~constants';
import {useTheme} from '~styles/ThemeProvider';
import {validateLinkedInUrl} from '~utils/services/GeneralServices';

const VerifyItem = (props) => {
  const {colors} = useTheme();
  let {item, inputValue, type, password, wifiCheck, wifi} = props.route.params;

  let {socialProfiles} = props.profileData;

  let socialProfileStates = {};
  AVAILABLE_SOCIAL_PROFILES.forEach((Type) => {
    socialProfileStates[Type] =
      socialProfiles[Type] || SOCIAL_PROFILES_PRODUCT_INIT[Type];
  });
  const [state, setState] = useState({...socialProfileStates});
  const [text, setText] = useState(item.icon === 'wifi' ? wifi : inputValue);
  const [text2, setText2] = useState(password);
  useEffect(() => {
    props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={4}
          title={item.label}
        />
      ),
    });
  }, []);
  const onSocialInputChanged = (textx) => {
    setText(textx);
    if (!state[type].userId && textx.trim()) {
      state[type].active = true;
    }

    let newState = {...state};

    newState[type].userId = textx;
    setState(newState);
  };

  const onSocialInputChanged2 = (textx, typex) => {
    setText2(textx);
    if (!state[typex].userId && textx.trim()) {
      state[typex].active = true;
    }

    let newState = {...state};

    newState[typex].userId = textx;
    setState(newState);
  };

  const onSwitchPress = ({typex, value}) => {
    let newState = {...state};
    newState[typex].active = value;
    setState(newState);
  };

  const onVerifyPress = () => {
    Alert.alert(
      'Verify',
      'To verify your account, please contact subscriptions@beapp.co',
      [{text: 'OK', onPress: () => {}}],
      {cancelable: false},
    );
  };

  const saveProfile = () => {
    let newSocialProfiles = {};

    if (props.activeProfileType === APP_PROFILE_TYPES.product) {
      if (state.wifi_ssid.userId ? !state.wifi.userId : state.wifi.userId) {
        Alert.alert(
          'Alert!',
          'You must add both Wi-Fi name and password or none.',
          [{text: 'OK', onPress: () => {}}],
          {cancelable: false},
        );

        return;
      }

      newSocialProfiles[SOCIAL_PROFILE_TYPES.wifi] = state.wifi;
      newSocialProfiles[SOCIAL_PROFILE_TYPES.wifi_ssid] = state.wifi_ssid;
      newSocialProfiles[SOCIAL_PROFILE_TYPES.menu] = state.menu;
    }

    newSocialProfiles[SOCIAL_PROFILE_TYPES.facebook] = state.facebook;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.snapchat] = state.snapchat;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.instagram] = state.instagram;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.twitter] = state.twitter;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.linkedin] = state.linkedin;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.whatsapp] = state.whatsapp;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.email] = state.email;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.pinterest] = state.pinterest;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.tiktok] = state.tiktok;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.youtube] = state.youtube;
    newSocialProfiles[SOCIAL_PROFILE_TYPES.telegram] = state.telegram;

    Object.keys(newSocialProfiles).forEach((key) => {
      newSocialProfiles[key].userId = newSocialProfiles[key].userId.trim();
    });

    if (
      type === SOCIAL_PROFILE_TYPES.linkedin &&
      text &&
      !validateLinkedInUrl(text)
    ) {
      Alert.alert(
        'Alert!',
        'Complete linkedin profile url required.',
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );

      return;
    }

    props.updateSocialProfiles(newSocialProfiles);

    props.navigation.navigate('ProfileScreen', {newSocialProfiles});
  };

  console.log('GlobalStyles()', GlobalStyles());
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.background,
      }}
      edges={['bottom']}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              paddingTop: 20,
            }}>
            {item.icon === 'menu' ||
            item.icon === 'wifi' ||
            item.icon === 'wifi_ssid' ? (
              <Icons
                name={item.icon === 'menu' ? item.icon : 'wifi'}
                size={30}
                color={colors.text}
              />
            ) : (
              <>
                {state[item.icon].active ? (
                  generateSVG({name: item.icon, height: 30, width: 30})
                ) : (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={generateIcon(`${item.icon}_bw`)}
                  />
                )}
              </>
            )}
            <Text h3 style={{marginLeft: 5}} color={colors.text}>
              {item.label}
            </Text>
          </View>
          <TextInput
            placeholder={APPS_DATA[type].placeholder || type}
            placeholderTextColor={colors.text}
            onChangeText={(textx) => onSocialInputChanged(textx)}
            style={GlobalStyles().inputStyle}
            value={text}
          />
          {wifiCheck ? (
            <TextInput
              placeholder={'Wifi-Password'}
              onChangeText={(textx) =>
                onSocialInputChanged2(textx, 'wifi_ssid')
              }
              placeholderTextColor={colors.text}
              style={{
                backgroundColor: colors.modal,
                marginHorizontal: 20,
                marginTop: 5,
                borderRadius: 4,
                padding: 12,
                color: colors.text,
              }}
              value={text2}
            />
          ) : null}
          <View style={{position: 'absolute', right: 20, top: 18}}>
            <Switch
              thumbColor={Colors.thumbColor}
              trackColor={{
                false: colors.inActiveTab,
                true: colors.activeTab,
              }}
              onValueChange={(value) =>
                onSwitchPress({typex: SOCIAL_PROFILE_TYPES[item.icon], value})
              }
              value={state[item.icon].active}
            />
          </View>
        </View>
        <View style={{marginBottom: 20, marginHorizontal: 20}}>
          <Button h4 onPress={() => saveProfile()} buttonType={'secondary'}>
            Save
          </Button>
          <View style={{margin: 5}} />
          <Button h4 onPress={() => onVerifyPress()}>
            Verify
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const {profileData, activeProfileType} = state.profile;

  return {
    profileData,
    activeProfileType,
  };
};

export default connect(mapStateToProps, {updateSocialProfiles})(VerifyItem);
