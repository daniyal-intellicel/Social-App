import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/Entypo';

import {Icon, Text} from '.';
import {Colors} from '~styles';

export default (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.yellow[0],
        backgroundColor: '#FFF8D9',
        height: 60,
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal: 10,
        marginTop: 10,
      }}>
      <View
        style={{
          height: 35,
          width: 35,
          borderRadius: 8,
          backgroundColor: Colors.yellow[0],
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 4,
        }}>
        <Icon name={'exclamation'} fill={Colors.light} height="25" width="25" />
      </View>
      <View style={{width: '80%'}}>
        <Text h5>
          You will not be discoverable until you set your profile image
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.callBack();
        }}>
        <Icons name="cross" size={25} color={Colors.grey[3]} />
      </TouchableOpacity>
    </View>
  );
};
