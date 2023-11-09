import {useTheme} from './ThemeProvider';
// const { height } = Dimensions.get('window');

const Styles = () => {
  const {colors} = useTheme();

  return {
    textStyle: {fontFamily: 'Inter'},
    inputStyle: {
      backgroundColor: colors.inputColor,
      marginHorizontal: 20,
      marginTop: 5,
      borderRadius: 4,
      padding: 12,
      height: 40,
      color: colors.text,
    },
  };
};

export default Styles;
