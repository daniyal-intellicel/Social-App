import React from 'react';
import {Image, View, TouchableWithoutFeedback} from 'react-native';
import {Switch} from 'react-native-paper';
import Icons from 'react-native-vector-icons/Ionicons';

import {Text} from '../../../components/common';
import {Colors} from '../../../styles';
import {generateIcon, generateSVG} from '../../../helpers';
import {useTheme} from '~styles/ThemeProvider';

export default ({
  item,
  typeStyle = 1,
  callBack,
  type,
  iconType = 1,
  socialProfileData,
  onSwitchPress,
  onLongPress = () => {},
}) => {
  const {colors} = useTheme();
  return (
    <>
      {item.icon === 'wifi_ssid' ? null : (
        <TouchableWithoutFeedback
          onPress={() => (callBack ? callBack(item) : {})}
          onLongPress={() => {
            onLongPress(item);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
              paddingHorizontal: 10,
              justifyContent: 'space-between',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {item.displayName && item.email !== '' ? (
                <>{generateSVG({name: 'email', height: 30, width: 30})}</>
              ) : iconType === 1 ? (
                <>
                  {(socialProfileData && socialProfileData.active) ||
                  (item.displayName && item.email !== '') ? (
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
              ) : (
                <Icons
                  name={item.icon === 'menu' ? item.icon : 'wifi'}
                  size={30}
                  color={colors.text}
                />
              )}
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {iconType !== 1 && typeStyle === 4 ? (
                  <Text h4 bold color={colors.text}>{`${item.label}: `}</Text>
                ) : null}
                {item.displayName && item.email !== '' ? (
                  <Text h4 color={colors.text}>
                    {typeStyle === 4 ? item.email : item.displayName}
                  </Text>
                ) : (
                  <Text h4 color={colors.text}>
                    {typeStyle !== 4 ? item.label : item.userId}
                  </Text>
                )}
              </View>
            </View>
            {/* {typeStyle === 1 ? (
            <Icon name="arrow-right" size={20} color={Colors.grey[3]} />
          ) : null} */}
            {typeStyle === 2 ? (
              <View style={{flexDirection: 'row'}}>
                {socialProfileData && socialProfileData.verified ? (
                  <Text h4 color={Colors.green[0]} style={{marginRight: 8}}>
                    Verified
                  </Text>
                ) : (
                  <Text h4 color={Colors.orange[0]} style={{marginRight: 8}}>
                    Unverified
                  </Text>
                )}
              </View>
            ) : null}
            {typeStyle === 3 ? (
              <Switch
                thumbColor={Colors.thumbColor}
                trackColor={{
                  false: colors.inActiveTab,
                  true: colors.activeTab,
                }}
                onValueChange={onSwitchPress}
                value={socialProfileData && socialProfileData.active}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};
