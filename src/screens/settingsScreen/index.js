import React, {useEffect} from 'react';
import {TouchableWithoutFeedback, View, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/ScreenContainer';
import {settings} from '../../constants/userData';
import {Text} from '../../components/common';
import {Colors} from '../../styles';
import HeaderOptions from '../../helpers/HeaderOptions';
import {useTheme} from '~styles/ThemeProvider';

export default (props) => {
  const {colors} = useTheme();
  useEffect(() => {
    props.navigation.setOptions({
      header: ({navigation, route, options, back}) => (
        <HeaderOptions
          navigation={navigation}
          route={route}
          options={options}
          back={back}
          type={1}
        />
      ),
    });
  }, []);

  // const toggleScheme = () => {
  //   isDark ? setScheme('light') : setScheme('dark');
  //   storeData(isDark);
  // };

  // const storeData = async (value) => {
  //   try {
  //     const check = JSON.stringify(!value);
  //     await AsyncStorage.setItem('themeCheck', check);
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  const itemHandler = (index) => {
    index === 3
      ? Linking.openURL('https://beapp.co/about-us/').catch((err) =>
          console.error("Couldn't load page", err),
        )
      : null;

    index === 1
      ? Linking.openURL('https://blog.beapp.co/privacy-policy/').catch((err) =>
          console.error("Couldn't load page", err),
        )
      : null;

    index === 2
      ? Linking.openURL('https://beapp.co/benefits/').catch((err) =>
          console.error("Couldn't load page", err),
        )
      : null;

    index === 0
      ? props.navigation.navigate('RadiusScreen', {buttonCheck: true})
      : null;
  };

  const renderItem = (item, index) => {
    return (
      <TouchableWithoutFeedback key={index} onPress={() => itemHandler(index)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}>
          <Text h4 color={colors.text}>
            {item.label}
          </Text>
          <View style={{flexDirection: 'row'}}>
            {/* {item.text ? (
              <Text h5 color={Colors.grey[5]}>
                {item.text}
              </Text>
            ) : null} */}
            <View style={{margin: 5}} />
            <Icon name="arrow-right" size={20} color={Colors.grey[3]} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <ScreenContainer style={{backgroundColor: colors.background}}>
      <View style={{backgroundColor: colors.modal, marginTop: 20}}>
        {settings.map((item, index) => {
          return renderItem(item, index);
        })}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
            paddingHorizontal: 20,
          }}>
          <Text h4 color={colors.text}>
            Dark Mode:{' '}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleScheme}
            thumbColor={colors.activeTab}
            trackColor={{
              false: colors.inActiveTab,
              true: colors.activeTab,
            }}
          />
        </View> */}
      </View>
    </ScreenContainer>
  );
};
