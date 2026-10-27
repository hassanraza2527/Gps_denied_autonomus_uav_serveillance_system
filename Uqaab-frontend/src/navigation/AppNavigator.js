import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LoginScreen,
  SignUpScreen,
  EmptyStateScreen,
  EditPropertyScreen,
  AddPropertyScreen,
  HomeScreen,
  SettingsScreen,
  ManageAuthorizedPeopleScreen,
  AddAuthorizedPersonScreen,
  EditAuthorizedPersonScreen,
  ManageCamerasScreen,
  AddNewCameraScreen,
  EditCameraScreen,
  DroneFlightLogsScreen,
  LaserGridViewScreen,
  ManageDronesScreen,
  AddNewDroneScreen,
  EditDroneScreen,
  CameraStreamScreen,
  AlertDetailScreen,
  WallCalibrationScreen,
  DefineCameraCellsScreen,
 } from '../screens/index ';
 import TabNavigator from './TabNavigator';



const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EmptyState" component={EmptyStateScreen} />
        <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
        <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PropertyTabs" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ManageAuthorizedPeople" component={ManageAuthorizedPeopleScreen} />
        <Stack.Screen name="AddAuthorizedPerson" component={AddAuthorizedPersonScreen} />
        <Stack.Screen name="EditAuthorizedPerson" component={EditAuthorizedPersonScreen} />
        <Stack.Screen name="ManageCameras" component={ManageCamerasScreen} />
        <Stack.Screen name="EditCamera" component={EditCameraScreen} />
        <Stack.Screen name="AddCamera" component={AddNewCameraScreen} />
        <Stack.Screen name="DroneFlightLogs" component={DroneFlightLogsScreen} />
        <Stack.Screen name="LaserGridView" component={LaserGridViewScreen} />
        <Stack.Screen name="ManageDrones" component={ManageDronesScreen}/>
        <Stack.Screen name="AddDrone" component={AddNewDroneScreen}/>
        <Stack.Screen name="EditDrone" component={EditDroneScreen}/>
        <Stack.Screen name="CameraStream" component={CameraStreamScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Stack.Screen name="WallCalibration" component={WallCalibrationScreen} />
<Stack.Screen name="DefineCameraCells" component={DefineCameraCellsScreen} />

      
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;