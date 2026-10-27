import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

const PlaySolidIcon = ({ width = 24, height = 24, color = "#FFF" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Polygon points="5 3 19 12 5 21 5 3" />
  </Svg>
);

export default PlaySolidIcon;