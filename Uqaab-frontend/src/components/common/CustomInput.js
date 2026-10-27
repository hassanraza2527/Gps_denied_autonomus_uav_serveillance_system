import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';

const CustomInput = ({ Icon, placeholder, secureTextEntry, RightIcon, onRightIconPress, ...props }) => (
  <View style={styles.container}>
    {Icon && <Icon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#A0A0A0"
      secureTextEntry={secureTextEntry}
      {...props}
    />
    {/* Wrap RightIcon in a TouchableOpacity to make it clickable */}
    {RightIcon && (
      <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
        <RightIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F7F2',
    borderWidth: 1,
    borderColor: '#E8E1D3',
    borderRadius: normalize(15),
    paddingHorizontal: normalize(15),
    height: normalize(58),
    marginBottom: normalize(15),
  },
  input: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(15),
    color: '#333',
  },
  iconButton: {
    padding: normalize(5), // Adds a bit of padding to make it easier to tap
  }
});

export default CustomInput;