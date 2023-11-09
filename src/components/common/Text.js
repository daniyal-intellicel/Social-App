import React from 'react';
import {StyleSheet, Text as RnText, Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import GlobalStyles, {Colors} from '~styles';

const windowHeight = Dimensions.get('window').height;

const Text = (props) => {
  const {
    children,
    style,
    bold,
    color,
    h0,
    h1,
    h2,
    h3,
    h4,
    h5,
    h18,
    light,
    grey,
    underline,
  } = props;

  const styling = [];

  styling.push(style);

  let fontSizeStyle = styles.p;

  h5 && (fontSizeStyle = styles.h5);
  h4 && (fontSizeStyle = styles.h4);
  h3 && (fontSizeStyle = styles.h3);
  h2 && (fontSizeStyle = styles.h2);
  h1 && (fontSizeStyle = styles.h1);
  h0 && (fontSizeStyle = styles.h0);
  h18 && (fontSizeStyle = styles.h18);

  styling.push(fontSizeStyle);

  bold && styling.push(styles.bold);

  const greyShade = !grey
    ? null
    : typeof grey === 'number'
    ? Colors.grey[grey]
    : Colors.grey[1];

  let textColor = color
    ? color
    : light
    ? Colors.light
    : greyShade || Colors.dark;

  styling.push({color: textColor});

  underline &&
    styling.push({
      borderBottomWidth: fontSizeStyle.fontSize * (1 / styles.p.fontSize),
      borderColor: textColor,
    });

  const textComponent = (
    <RnText
      {...props}
      style={[GlobalStyles().textStyle, ...styling, props.style]}>
      {children}
    </RnText>
  );

  return textComponent;
};

const styles = StyleSheet.create({
  bold: {fontWeight: 'bold'},
  p: {fontSize: RFValue(12, windowHeight)},
  h5: {fontSize: RFValue(14, windowHeight)},
  h4: {fontSize: RFValue(16, windowHeight)},
  h3: {fontSize: RFValue(20, windowHeight)},
  h2: {fontSize: RFValue(22, windowHeight)},
  h1: {fontSize: RFValue(24, windowHeight)},
  h0: {fontSize: RFValue(28, windowHeight)},
  h18: {fontSize: RFValue(18, windowHeight)},
});

export default Text;
