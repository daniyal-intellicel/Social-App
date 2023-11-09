import {Platform} from 'react-native';
import {useTheme} from './ThemeProvider';
// const { height } = Dimensions.get('window');

export const StylesGlobal = () => {
  const {colors} = useTheme();

  return {
    textStyle: {
      fontFamily:
        Platform.OS === 'ios'
          ? {fontFamily: 'Poppins', fontWeight: 'normal'}
          : {fontFamily: 'Poppins-Regular', fontWeight: 'normal'},
      bold:
        Platform.OS === 'ios'
          ? {fontFamily: 'Poppins', fontWeight: 'bold'}
          : {fontFamily: 'Poppins-Bold', fontWeight: 'normal'},
      h1: {fontSize: 24},
      h2: {fontSize: 19},
      h3: {fontSize: 15},
      h4: {fontSize: 13},
      h5: {fontSize: 11},
      smallText: {fontSize: 8},
    },
    inputStyle: {
      backgroundColor: colors.inputColor,
      marginHorizontal: 20,
      marginTop: 5,
      borderRadius: 4,
      padding: 12,
      color: colors.text,
    },
  };
};
