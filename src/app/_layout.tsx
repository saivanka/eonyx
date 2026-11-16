import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { StoreProvider } from '@/store/StoreContext';
import { WEB_MAX_WIDTH } from '@/lib/layout';

// The first screen is Discover at "/", which is also the PWA start URL.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F4F1' }}>
        <ActivityIndicator color="#121212" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StoreProvider>
          <RootStack />
        </StoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootStack() {
  const { colors, isDark } = useTheme();
  const isWeb = Platform.OS === 'web';

  // On the web the app sits in a phone-width column centred in the browser window.
  // On native devices the column is simply the full screen.
  return (
    <View style={[styles.shell, { backgroundColor: isWeb ? (isDark ? '#050505' : '#E7E2DA') : colors.bg }]}>
      <View style={[styles.column, { backgroundColor: colors.bg }, isWeb && styles.columnWeb]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="category/[id]" />
          <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
          <Stack.Screen name="order/[id]" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, alignItems: 'center' },
  column: { flex: 1, width: '100%', overflow: 'hidden' },
  columnWeb: {
    maxWidth: WEB_MAX_WIDTH,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
});
