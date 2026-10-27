import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
const XCircleIcon = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="#E57373" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="15" y1="9" x2="9" y2="15" />
    <Line x1="9" y1="9" x2="15" y2="15" />
  </Svg>
);
export default XCircleIcon;