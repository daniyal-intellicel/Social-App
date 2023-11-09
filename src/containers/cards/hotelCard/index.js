import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';

import {Text} from '~components/common';
import {Colors} from '~styles';
import {useTheme} from '~styles/ThemeProvider';

export default ({item, callback, endType, endData, threadData, badge}) => {
  const {colors} = useTheme();

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
                {item.displayName}
              </Text>
              <Text h5 color={colors.dusItemStatus}>
                {item.email}
              </Text>
            </View>
          </View>
          {endType === 'icon' ? (
            <Icon name="arrow-right" size={20} color={Colors.grey[3]} />
          ) : (
            <View>
              <Text color={colors.text}>
                {moment(threadData ? threadData : endData).format('hh:mm A')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
