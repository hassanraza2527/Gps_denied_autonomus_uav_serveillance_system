import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

const UndoIcon = ({ width = 24, height = 24, color = "#1A1A1A" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 14 4 9 9 4" />
    <Path d="M20 20v-7a4 4 0 0 0-4-4H4" />
  </Svg>
);

export default UndoIcon;