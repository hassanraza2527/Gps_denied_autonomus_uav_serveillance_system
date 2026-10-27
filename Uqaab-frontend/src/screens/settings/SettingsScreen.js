import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';
import SettingsRow from '../../components/common/SettingsRow';
import {
  ChevronLeftIcon,
  VideoOutlineIcon,
  PlaneIcon,
  UsersIcon,
  ListLogsIcon,
  GridIcon,
  HomeIcon,
  LogoutIcon,
} from '../../assets/icons';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';


const SettingsScreen = ({ navigation, route }) => {
  // ✅ Receive propertyId + propertyName forwarded from DashboardScreen
  const propertyId   = route?.params?.propertyId;
  const propertyName = route?.params?.propertyName || 'Property';

  const dispatch = useDispatch();


  const handleLogout = () => {
  // 1. Clear Redux / AsyncStorage
  dispatch(logout()); 

  // 2. WIPE THE NAVIGATION HISTORY AND GO TO LOGIN
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Replace 'Login' with the exact name of your login route
    })
  );
};

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings: {propertyName}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>

          {/* ✅ Forward propertyId to every sub-screen */}
          <SettingsRow
            Icon={VideoOutlineIcon}
            title="Manage Cameras"
            onPress={() => navigation.navigate('ManageCameras', { propertyId })}
          />
          <SettingsRow
            Icon={PlaneIcon}
            title="Manage Drones"
            onPress={() => navigation.navigate('ManageDrones', { propertyId })}
          />
          <SettingsRow
            Icon={UsersIcon}
            title="Authorized People"
            onPress={() => navigation.navigate('ManageAuthorizedPeople', { propertyId })}
          />
          <SettingsRow
            Icon={ListLogsIcon}
            title="Drone Flight Logs"
            onPress={() => navigation.navigate('DroneFlightLogs', { propertyId })}
          />
          <SettingsRow
            Icon={GridIcon}
            title="Laser Grid View"
            onPress={() =>
              navigation.navigate('LaserGridView', {
                propertyId,
                xLasers: 3,
                yLasers: 8,
                boxWidth: 2.0,
                boxLength: 2.0,
                gridHeight: 2.4,
              })
            }
          />
          <SettingsRow
            Icon={HomeIcon}
            title="Manage Property Details"
            onPress={() => navigation.navigate('EditProperty', { propertyId })}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.logoutContainer}>
          <SettingsRow
            Icon={LogoutIcon}
            title="Logout"
            isDestructive={true}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(20),
  },
  backButton: {
    padding: normalize(5),
    marginLeft: -normalize(5),
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: normalize(10),
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E1D3',
    marginHorizontal: normalize(20),
    marginVertical: normalize(10),
  },
  logoutContainer: {
    marginBottom: normalize(30),
  },
});

export default SettingsScreen;