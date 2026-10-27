import React from 'react';
import Svg, { Circle, Polygon } from 'react-native-svg';

const ArrowRightCircleSolidIcon = ({ width = 24, height = 24, color = "#C8AD84" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="10" />
    <Polygon points="10 8 16 12 10 16 10 8" fill="#FFF" />
  </Svg>
);

export default ArrowRightCircleSolidIcon;