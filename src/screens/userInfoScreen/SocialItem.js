import React from 'react';
import {Image, View, TouchableWithoutFeedback} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import {Text} from '~components/common';
// import {Colors} from '~styles';
import {generateIcon, generateSVG} from '~helpers';
import {useTheme} from '~styles/ThemeProvider';

export default ({
  item,
  typeStyle = 1,
  callBack,
  user = null,
  type,
  iconType = 1,
  socialProfileData,
  onSwitchPress,
  onLongPress = () => {},
}) => {
  const {colors} = useTheme();
  const {active} = item;
  if (active) {
    return (
      <>
        {item.icon === 'wifi_ssid' ? null : (
          <TouchableWithoutFeedback
            onPress={() => (callBack ? callBack(item) : {})}
            onLongPress={() => onLongPress(item)}>
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
                {iconType === 1 ? (
                  <>
                    {socialProfileData && socialProfileData.active ? (
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
                  <Text h4 color={colors.text}>
                    {typeStyle !== 4 ? item.label : item.userId}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </>
    );
  } else {
    return null;
  }
};
