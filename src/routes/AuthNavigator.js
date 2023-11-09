import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/loginScreen';
import IntroScreen from '~screens/introScreen';
// import {useTheme} from '~styles/ThemeProvider';

const Stack = createStackNavigator();

export default () => {
  // const {setScheme} = useTheme();
  const [introCheck, setIntroCheck] = useState(false);
  const [mainCheck, setMainCheck] = useState(false);
  useEffect(() => {
    getData();
    // getModeCheck();
  }, []);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('introCheck');
      if (jsonValue != null) {
        let obj = JSON.parse(jsonValue);
        setIntroCheck(obj.check ? obj.check : null);
        setMainCheck(true);
      } else {
        setMainCheck(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  // const getModeCheck = async () => {
  //   try {
  //     let check = await AsyncStorage.getItem('themeCheck');
  //     check = JSON.parse(check);
  //     setScheme(check ? 'dark' : 'light');
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  return (
    <>
      {mainCheck ? (
        <Stack.Navigator
          initialRouteName={introCheck ? 'LoginScreen' : 'IntroScreen'}>
          <Stack.Screen
            name="IntroScreen"
            component={IntroScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : null}
    </>
  );
};
