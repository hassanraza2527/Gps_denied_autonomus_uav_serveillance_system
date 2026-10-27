import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const CheckCircleSolidIcon = ({ width = 24, height = 24, color = "#4CAF50" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12l3 3 5-6" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default CheckCircleSolidIcon;