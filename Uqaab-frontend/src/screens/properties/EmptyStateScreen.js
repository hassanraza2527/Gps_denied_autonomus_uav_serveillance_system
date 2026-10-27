import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';

import {HomeIcon} from '../../assets/icons/index'; 

const EmptyStateScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.iconContainer}>
          <HomeIcon width={normalize(80)} height={normalize(80)} color="#C8AD84" />
        </View>

        {/* You can make this name dynamic later when you hook up RTK Query */}
        <Text style={styles.title}>Welcome, Hassan Raza!</Text>
        
        <Text style={styles.subtitle}>
          It looks like you don't have any properties set up yet. Let's add your first one to get started.
        </Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProperty')}
        >
          <Text style={styles.addButtonText}>Add Your First Property</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FCFAF8' // Matching the warm off-white background
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: normalize(30) 
  },
  iconContainer: {
    marginBottom: normalize(25),
  },
  title: { 
    fontSize: normalize(22), 
    fontWeight: 'bold', 
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: normalize(15),
  },
  subtitle: { 
    fontSize: normalize(16), 
    color: '#555555', 
    textAlign: 'center',
    lineHeight: normalize(24), // Improves readability for multiline text
    marginBottom: normalize(40),
  },
  addButton: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  addButtonText: {
    fontSize: normalize(17),
    fontWeight: '600',
    color: '#C8AD84', // The gold/tan accent color
  }
});

export default EmptyStateScreen;