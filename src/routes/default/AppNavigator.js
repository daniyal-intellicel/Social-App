import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

import AppTabNavigators from './AppTabNavigators';
import {HotelStackNavigator as HotelNavigator} from './StackNavigators';
import RadiusScreen from '../../screens/radiusScreen';
import ProfileScreen from '../../screens/profileScreen';
import BookedToursScreen from '~screens/bookedToursScreen';
import ViewTourScreen from '~screens/viewTourScreen';
import viewTransferScreen from '~screens/viewTransferScreen';
import BookedTransfersScreen from '~screens/bookedTransfersScreen';
import VerifySocialScreen from '../../screens/profileScreen/VerifyItem';

import HotelListScreen from '../../screens/hotelListScreen';
import HotelScreen from '../../screens/hotelScreen';
import HotelOptionsScreen from '../../screens/hotelOptionsScreen';
import TourListScreen from '../../screens/tourListScreen';
import BookTourScreen from '../../screens/bookTourScreen';
import TransferListScreen from '../../screens/transferListScreen';
import BookTransferScreen from '~screens/bookTransferScreen';
import TicketTourListScreen from '~screens/ticketTourListScreen';
import BookTicketTourScreen from '~screens/bookTicketTourScreen';
import GuideTicketTourListScreen from '~screens/guideTicketTourListScreen';
import BookGuideTicketTourScreen from '~screens/bookGuideTicketTourScreen';

import UserInfoScreen from '../../screens/userInfoScreen';
import MessageScreen from '~screens/messageScreen';
import Notification from '~utils/Notification';

const Stack = createStackNavigator();

export default () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('RadiusScreen');
  const [initialMessageData, setInitialMessageData] = useState(null);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage,
      // );
      navigation.navigate(
        remoteMessage.data.type === 'chat'
          ? 'MessageScreen'
          : 'AppTabNavigators',
        {user: JSON.parse(remoteMessage.data.user)},
      );
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage,
          // );
          setInitialMessageData({user: JSON.parse(remoteMessage.data.user)});
          setInitialRoute(
            remoteMessage.data.type === 'chat'
              ? 'MessageScreen'
              : 'AppTabNavigators',
          );
        }

        setLoading(false);
      });

    messaging().onMessage(async (remoteMessage) => {
      console.log('OnMessage', remoteMessage);
      Notification.localChatNotification(remoteMessage, navigation);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="RadiusScreen"
        component={RadiusScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="AppTabNavigators"
        component={AppTabNavigators}
        options={{headerShown: false}}
      /> */}
      {/* <Stack.Screen
        name="HotelNavigator"
        component={HotelNavigator}
        options={{headerShown: false}}
      /> */}
      {/* <Stack.Screen
        name="HotelListScreen"
        component={HotelListScreen}
        // options={{headerShown: false}}
      /> */}
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
      <Stack.Screen
        name="TicketTourListScreen"
        component={TicketTourListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookTicketTourScreen"
        component={BookTicketTourScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="GuideTicketTourListScreen"
        component={GuideTicketTourListScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookGuideTicketTourScreen"
        component={BookGuideTicketTourScreen}
        // options={{headerShown: false}}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="BookedToursScreen" component={BookedToursScreen} />
      <Stack.Screen name="ViewTour" component={ViewTourScreen} />
      <Stack.Screen name="ViewTransfer" component={viewTransferScreen} />
      <Stack.Screen
        name="BookedTransfersScreen"
        component={BookedTransfersScreen}
      />
      <Stack.Screen
        name="AppTabNavigators"
        component={AppTabNavigators}
        options={{headerShown: false}}
      />
      <Stack.Screen name="VerifySocialScreen" component={VerifySocialScreen} />
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
        initialParams={initialMessageData}
      />
    </Stack.Navigator>
  );
};
