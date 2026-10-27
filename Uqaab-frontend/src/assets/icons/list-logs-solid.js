import React from 'react';
import Svg, { Rect, Line } from 'react-native-svg';

const ListLogsSolidIcon = ({ width = 80, height = 80, color = "#C8AD84" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="square">
    <Rect x="3" y="3" width="18" height="18" strokeWidth="2" />
    <Line x1="7" y1="8" x2="7.01" y2="8" strokeWidth="3" />
    <Line x1="11" y1="8" x2="17" y2="8" strokeWidth="2" />
    <Line x1="7" y1="12" x2="7.01" y2="12" strokeWidth="3" />
    <Line x1="11" y1="12" x2="17" y2="12" strokeWidth="2" />
    <Line x1="7" y1="16" x2="7.01" y2="16" strokeWidth="3" />
    <Line x1="11" y1="16" x2="17" y2="16" strokeWidth="2" />
  </Svg>
);

export default ListLogsSolidIcon;