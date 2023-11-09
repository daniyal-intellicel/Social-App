import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import DrawerComponent from '../components/Drawer';
import AppNavigator from './default/AppNavigator';
// import {useTheme} from '~styles/ThemeProvider';

const Drawer = createDrawerNavigator();

export default () => {
  // const {setScheme} = useTheme();
  // useEffect(() => {
  //   getData();
  // }, []);

  // const getData = async () => {
  //   try {
  //     let check = await AsyncStorage.getItem('themeCheck');
  //     check = JSON.parse(check);
  //     setScheme(check ? 'dark' : 'light');
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  return (
    <Drawer.Navigator
      backBehavior="none"
      drawerType="slide"
      drawerContent={(props) => <DrawerComponent {...props} />}
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="AppNavigator" component={AppNavigator} />
    </Drawer.Navigator>
  );
};
