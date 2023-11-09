import * as React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  HotelStackNavigator,
  DiscoverStackNavigator,
  ChatStackNavigator,
  ContactStackNavigator,
  SettingsStackNavigator,
} from './StackNavigators';
import {useTheme} from '~styles/ThemeProvider';

const Tab = createBottomTabNavigator();

export default function AppTabNavigators() {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          // height: 60,
          // paddingHorizontal: 5,
          // paddingVertical: 5,
          // paddingTop: 0,
          backgroundColor: colors.tabBarColor,
          borderTopWidth: 0,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let colorName;

          if (route.name === 'Hotel') {
            iconName = focused ? 'location' : 'location-outline';
            colorName = focused ? colors.activeTab : colors.inActiveTab;
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass-sharp' : 'compass-outline';
            colorName = focused ? colors.activeTab : colors.inActiveTab;
          } else if (route.name === 'Chat') {
            iconName = focused ? 'ios-chatbox' : 'ios-chatbox-outline';
            colorName = focused ? colors.activeTab : colors.inActiveTab;
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'person' : 'person-outline';
            colorName = focused ? colors.activeTab : colors.inActiveTab;
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-settings' : 'ios-settings-outline';
            colorName = focused ? colors.activeTab : colors.inActiveTab;
          }

          return <Icon name={iconName} size={30} color={colorName} />;
        },
        tabBarActiveTintColor: colors.activeTab,
        tabBarInactiveTintColor: colors.inActiveTab,
      })}>
      <Tab.Screen
        name="Discover"
        component={DiscoverStackNavigator}
        options={{headerShown: false}}
      />
      {/* <Tab.Screen
        name="Hotel"
        component={HotelStackNavigator}
        options={{
          headerShown: false,
          tabBarButton: () => <View style={{width: 0, height: 0}}></View>,
        }}
      /> */}
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
