import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../styles';

export default ({children, style, modalVisible, modalOnClose}) => {
  return <View style={[styles.containerStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.grey[8],
  },
});
