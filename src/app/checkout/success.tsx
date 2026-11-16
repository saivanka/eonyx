import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/lib/haptics';
import { Button, Screen } from '@/components/ui';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { money } from '@/lib/format';
import { gutter, space, type } from '@/theme/tokens';

export default function Success() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { state } = useStore();
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const order = state.orders.find((o) => o.id === id);

  useEffect(() => {
    haptics.success();
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  return (
    <Screen>
      <View style={styles.center}>
        <Animated.View style={[styles.badge, { backgroundColor: colors.success, transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </Animated.View>
        <Animated.View style={{ opacity: fade, alignItems: 'center', gap: space.sm, paddingHorizontal: gutter }}>
          <Text style={[type.overline, { color: colors.highlight, marginTop: space.xl }]}>ORDER {id}</Text>
          <Text style={[type.h1, { color: colors.text, textAlign: 'center' }]}>Thank you. It is on its way.</Text>
          <Text style={[type.body, { color: colors.textMuted, textAlign: 'center' }]}>
            {order?.delivery === 'pickup'
              ? 'We will message you when it is ready at your partner point.'
              : 'Track the courier from dispatch to your door. Estimated arrival about 45 minutes after dispatch.'}
          </Text>
          {order ? (
            <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[type.caption, { color: colors.textMuted }]}>Order total</Text>
              <Text style={[type.priceLg, { color: colors.text }]}>{money(order.total)}</Text>
            </View>
          ) : null}
        </Animated.View>
      </View>
      <View style={{ paddingHorizontal: gutter, paddingBottom: space.md, gap: space.sm }}>
        <Button title="Track my order" icon="navigate-outline" onPress={() => router.replace(`/order/${id}`)} />
        <Button title="Keep shopping" variant="secondary" onPress={() => router.replace('/(tabs)')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: space.xxl },
  badge: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  summary: { marginTop: space.lg, paddingHorizontal: space.xl, paddingVertical: space.md, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth * 2, alignItems: 'center', gap: 2 },
});
