import React from 'react';
import {View} from 'react-native';

import Text from './Text';

export const Snackbar = ({
  message = '',
  type = null,
  visible,
  ticker = false,
}) => {
  let backgroundColor = '#445bdf';

  switch (type) {
    case 'error':
      backgroundColor = '#b92b27';
      break;
    case 'success':
      backgroundColor = '#15991b';
      break;
    case 'warning':
      backgroundColor = '#e3cd00';
      break;
    default:
      break;
  }

  return visible ? (
    <View
      style={{
        backgroundColor,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}>
      <Text h5 style={{color: '#ffffff'}}>
        {message}
      </Text>
    </View>
  ) : null;
};
