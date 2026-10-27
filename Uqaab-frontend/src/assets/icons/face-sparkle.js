import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const FaceSparkleIcon = ({ width = 24, height = 24, color = "#C8AD84" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <Line x1="9" y1="9" x2="9.01" y2="9" />
    <Line x1="15" y1="9" x2="15.01" y2="9" />
  </Svg>
);

export default FaceSparkleIcon;