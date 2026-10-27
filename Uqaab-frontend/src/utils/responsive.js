import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const widthBaseScale = SCREEN_WIDTH / 375;

export const normalize = (size) => {
  const newSize = size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};