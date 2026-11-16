import { Platform, useWindowDimensions } from 'react-native';

// On the web the app is shown as a phone-width column, centred in the browser.
export const WEB_MAX_WIDTH = 480;

// Width the app content should be laid out in. Use this instead of the raw
// window width so grids and galleries fit the phone column on desktop browsers.
export function useAppWidth(): number {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' ? Math.min(width, WEB_MAX_WIDTH) : width;
}
