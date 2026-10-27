import React from 'react';
import Svg, { Path } from 'react-native-svg';
const DoorIcon = ({ width = 24, height = 24, color = "#C64E4E" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12" />
    <Path d="M14 18H2" />
    <Path d="M8 12h2" />
  </Svg>
);
export default DoorIcon;