import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import Icons from 'react-native-vector-icons/Ionicons';

import {Text} from '~components/common';
import {Colors} from '~styles';
import {generateSVG} from '~helpers';
import {AVAILABLE_SOCIAL_PROFILES} from '~constants';
import {useTheme} from '~styles/ThemeProvider';

export default ({item, callback, endType, endData, threadData, badge}) => {
  const {colors, isDark} = useTheme();
  const renderSocialProfiles = (socialProfiles) => {
    let compareData = null;
    return Object.keys(socialProfiles).map((key, index) => {
      const {active, userId} = socialProfiles[key];
      if (key === 'wifi') {
        compareData = socialProfiles[key];
      }

      if (key === 'wifi_ssid') {
        if (compareData) {
          if (compareData.userId !== '' && socialProfiles[key].userId !== '') {
            return <Icons name={'wifi'} size={15} color={Colors.grey[3]} />;
          }
        }
      }

      if (key === 'wifi' || key === 'wifi_ssid' || key === 'menu') {
        return <View key={key}>{null}</View>;
      }

      return active && userId && AVAILABLE_SOCIAL_PROFILES.includes(key) ? (
        <View key={key} style={{paddingRight: 2}}>
          {generateSVG({name: key, height: 15, width: 15})}
        </View>
      ) : null;
    });
  };

  return (
    <>
      <TouchableOpacity onPress={() => (callback ? callback(item) : {})}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 25,
            marginVertical: 10,
            justifyContent: 'space-between',
            height: 60,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                height: 50,
                width: 50,
                borderRadius: 8,
              }}
              source={
                item.avatar
                  ? {uri: item.avatar}
                  : require('../../../assets/images/profileDefault.png')
              }
            />
            <View style={{marginLeft: 10}}>
              <Text h4 bold color={colors.text}>
                {item.name}
              </Text>
              <Text h5 color={colors.dusItemStatus}>
                {item.status}
              </Text>

              <View style={{flexDirection: 'row'}}>
                {renderSocialProfiles(item.socialProfiles)}
              </View>
            </View>
          </View>
          {endType === 'icon' ? (
            <Icon1 name="arrow-right" size={20} color={Colors.grey[3]} />
          ) : (
            <View>
              <Text color={colors.text}>
                {moment(threadData ? threadData : endData).format('hh:mm A')}
              </Text>
              {badge ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDark ? Colors.yellow[0] : Colors.blue[0],
                    height: 10,
                    width: 10,
                    borderRadius: 10,
                    alignSelf: 'flex-end',
                  }}>
                  {/* <Text color={Colors.light}>{item.count}</Text> */}
                </View>
              ) : null}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
