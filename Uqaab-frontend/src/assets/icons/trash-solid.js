import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TrashSolidIcon = ({ width = 24, height = 24, color = "#C64E4E" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Svg>
);

export default TrashSolidIcon;