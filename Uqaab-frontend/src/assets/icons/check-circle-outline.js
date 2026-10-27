import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const CheckCircleOutlineIcon = ({ width = 24, height = 24, color = "#4CAF50" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

export default CheckCircleOutlineIcon;