import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import HotelListScreen from '../../screens/hotelListScreen';
import HotelScreen from '../../screens/hotelScreen';
import HotelOptionsScreen from '../../screens/hotelOptionsScreen';
import TourListScreen from '../../screens/tourListScreen';
import BookTourScreen from '../../screens/bookTourScreen';
import TransferListScreen from '../../screens/transferListScreen';
import BookTransferScreen from '~screens/bookTransferScreen';
import DiscoverUserScreen from '../../screens/discoverUserScreen';
import ChatScreen from '../../screens/chatScreen';
import ContactScreen from '../../screens/contactScreen';
import SettingsScreen from '../../screens/settingsScreen';

const Stack = createStackNavigator();
export const HotelStackNavigator = () => {
  const discoveredHotels = useSelector((state) => state.hotel.hotelList.length);
  return (
    <Stack.Navigator
      initialRouteName={
        discoveredHotels === 1 ? 'HotelScreen' : 'HotelListScreen'
      }>
      <Stack.Screen
        name="HotelListScreen"
        component={HotelListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="HotelScreen"
        component={HotelScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="HotelOptionsScreen"
        component={HotelOptionsScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="TourListScreen"
        component={TourListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookTourScreen"
        component={BookTourScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransferListScreen"
        component={TransferListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookTransferScreen"
        component={BookTransferScreen}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const DiscoverStackNavigator = () => {
  const discoveredHotels = useSelector((state) => state.hotel.hotelList.length);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoverUserScreen"
        component={DiscoverUserScreen}
        initialParams={discoveredHotels === 1 ? {modalShow: true} : null}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const ChatStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const ContactStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        // options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
