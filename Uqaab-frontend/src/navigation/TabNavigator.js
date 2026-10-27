import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { normalize } from '../utils/responsive';
import { DashboardScreen, AlertsScreen, DroneControlScreen, GridMapScreen } from '../screens/index ';
import { GridIcon, BellIcon, MapPinIcon, PlaneIcon } from '../assets/icons/index';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  // Both propertyId (number) and propertyName (string) come from HomeScreen
  const propertyId   = route?.params?.propertyId;
  const propertyName = route?.params?.propertyName || '';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C8AD84',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#F9F7F2',
          borderTopWidth: 1,
          borderTopColor: '#E8E1D3',
          height: normalize(80),
          paddingBottom: normalize(25),
          paddingTop: normalize(10),
        },
        tabBarLabelStyle: {
          fontSize: normalize(12),
          fontWeight: '500',
          marginTop: normalize(5),
        },
        tabBarIcon: ({ color }) => {
          if (route.name === 'DashboardTab') return <GridIcon  width={24} height={24} color={color} />;
          if (route.name === 'AlertsTab')    return <BellIcon  width={24} height={24} color={color} />;
          if (route.name === 'MapTab')       return <MapPinIcon width={24} height={24} color={color} />;
          if (route.name === 'DroneTab')     return <PlaneIcon  width={24} height={24} color={color} />;
        },
      })}
    >
      {/* ── Every tab receives { propertyId, propertyName } ── */}
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
        initialParams={{ propertyId, propertyName }}
      />
      <Tab.Screen
        name="AlertsTab"
        component={AlertsScreen}
        options={{ title: 'Alerts' }}
        initialParams={{ propertyId, propertyName }}
      />
      <Tab.Screen
        name="MapTab"
        component={GridMapScreen}
        options={{ title: 'Map' }}
        initialParams={{ propertyId, propertyName }}
      />
      <Tab.Screen
        name="DroneTab"
        component={DroneControlScreen}
        options={{ title: 'Drone' }}
        initialParams={{ propertyId, propertyName }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;