import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';
import {ChevronRight} from '../../assets/icons/index';

const SettingsRow = ({ Icon, title, onPress, isDestructive = false }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Icon width={normalize(22)} height={normalize(22)} color={isDestructive ? '#C64E4E' : '#C8AD84'} />
        <Text style={[styles.title, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      
      {!isDestructive && (
        <ChevronRight width={normalize(20)} height={normalize(20)} color="#333" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(18),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(16),
    color: '#1A1A1A',
    marginLeft: normalize(15),
    fontWeight: '500',
  },
  destructiveText: {
    color: '#C64E4E',
  },
});

export default SettingsRow;