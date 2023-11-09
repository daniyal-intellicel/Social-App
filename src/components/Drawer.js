import React from 'react';
import {TouchableOpacity, View, Image, Linking} from 'react-native';
import {useSelector} from 'react-redux';
// import auth from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon1 from 'react-native-vector-icons/Ionicons';

import {Colors} from '../styles';
import {Text, Icon} from './common';
import {Images} from '~assets';
import {useTheme} from '~styles/ThemeProvider';

export default (props) => {
  const {colors, isDark} = useTheme();

  const profileData = useSelector((state) => state.profile.profileData);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.modal,
      }}>
      <View
        style={{
          padding: 20,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
            }}>
            <Image
              style={{
                height: 40,
                width: 40,
                borderRadius: 8,
              }}
              source={
                profileData.avatar
                  ? {
                      uri: profileData.avatar,
                    }
                  : Images.no_image
              }
            />
            <View style={{marginLeft: 6}}>
              <Text bold color={colors.text}>
                {profileData.name}
              </Text>
              <Text h6 color={colors.text}>
                {profileData.status}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('ProfileScreen');
            }}>
            <Icon1 name="person-outline" size={18} color={colors.text} />
            <Text style={{marginLeft: 4}} color={colors.text}>
              {'Profile'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('HotelOptionsScreen');
            }}>
            <Icon1 name="location-outline" size={18} color={colors.text} />
            <Text style={{marginLeft: 4}} color={colors.text}>
              {'Hotels'}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('BookedToursScreen');
            }}>
            <Icon1 name="receipt-outline" size={18} color={colors.text} />
            <Text style={{marginLeft: 4}} color={colors.text}>
              {'My Booking'}
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('BookedTransfersScreen');
            }}>
            <Icon1 name="airplane-outline" size={18} color={colors.text} />
            <Text style={{marginLeft: 4}} color={colors.text}>
              {'My Airport Transfers'}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#4B4B4B' : Colors.grey[8],
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => {
              Linking.openURL('https://beapp.co/benefits/').catch((err) =>
                console.error("Couldn't load page", err),
              );
            }}>
            <Icon name={'help'} fill={colors.text} height="18" width="18" />
            <Text style={{marginLeft: 4}} color={colors.text}>
              Help
            </Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            auth().signOut();
          }}>
          <View
            style={{
              paddingVertical: 10,
              borderColor: Colors.orange[0],
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              borderRadius: 20,
            }}>
            <Text color={Colors.orange[0]}>Logout</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};
