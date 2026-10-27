import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

const LogoutIcon = ({ width = 24, height = 24, color = "#C64E4E" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Line x1="16" y1="17" x2="21" y2="12" />
    <Line x1="21" y1="12" x2="16" y2="7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);
export default LogoutIcon;