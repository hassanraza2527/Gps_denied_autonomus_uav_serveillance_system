import React from 'react';
import Svg, { Path, Rect, Line } from 'react-native-svg';

const ListLogsIcon = ({ width = 24, height = 24, color = "#C8AD84" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Line x1="9" y1="9" x2="17" y2="9" />
    <Line x1="9" y1="13" x2="17" y2="13" />
    <Line x1="9" y1="17" x2="17" y2="17" />
    <Line x1="7" y1="9" x2="7.01" y2="9" strokeWidth="2" />
    <Line x1="7" y1="13" x2="7.01" y2="13" strokeWidth="2" />
    <Line x1="7" y1="17" x2="7.01" y2="17" strokeWidth="2" />
  </Svg>
);
export default ListLogsIcon;