// Haptics are native-only. On web they are skipped, and any failure is ignored
// so a missing vibration engine never breaks a tap.
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const run = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const haptics = {
  light: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  selection: () => run(() => Haptics.selectionAsync()),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
