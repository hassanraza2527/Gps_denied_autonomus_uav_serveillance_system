import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

const CameraOffOutlineIcon = ({ width = 48, height = 48, color = "#555" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="2" y1="2" x2="22" y2="22" />
    <Path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" />
    <Path d="M9.5 4h5L17 7h2a2 2 0 0 1 2 2v7.5" />
  </Svg>
);

export default CameraOffOutlineIcon;