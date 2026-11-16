import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState, Header, Screen, Divider, Button } from '@/components/ui';
import { OrderStatus, useStore } from '@/store/StoreContext';
import { getProduct } from '@/data/catalog';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { money, timeOf } from '@/lib/format';

const STATUS_ORDER: OrderStatus[] = ['placed', 'packed', 'out', 'delivered'];
const STATUS_COPY: Record<OrderStatus, { title: string; body: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  placed: { title: 'Order placed', body: 'We have your order and are preparing it.', icon: 'receipt-outline' },
  packed: { title: 'Packed with care', body: 'Your pieces are wrapped and labelled.', icon: 'cube-outline' },
  out: { title: 'Out for delivery', body: 'Your courier is on the way.', icon: 'bicycle-outline' },
  delivered: { title: 'Delivered', body: 'Enjoy. Returns are free for 30 days.', icon: 'checkmark-done-outline' },
};

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { state, advanceOrder } = useStore();
  const order = state.orders.find((o) => o.id === id);

  // Demo only: moves the order through its stages so the live timeline is visible.
  // In production this would come from your delivery provider's webhook or socket.
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const next = STATUS_ORDER[STATUS_ORDER.indexOf(order.status) + 1];
    const t = setTimeout(() => advanceOrder(order.id, next), 7000);
    return () => clearTimeout(t);
  }, [order, advanceOrder]);

  if (!order) {
    return (
      <Screen>
        <Header title="Order" onBack={() => router.back()} />
        <EmptyState icon="receipt-outline" title="Order not found" body="Check your orders in Profile." />
      </Screen>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const minutesLeft = Math.max(0, order.etaMinutes - Math.floor((Date.now() - order.createdAt) / 60000));
  const eta = order.status === 'delivered' ? 'Delivered' : order.status === 'out' ? `Arriving in ~${Math.max(5, minutesLeft)} min` : `Estimated ${order.etaMinutes} min`;

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title={`Order ${order.id}`} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md, paddingBottom: space.xxl }} showsVerticalScrollIndicator={false}>
        {/* Live map card */}
        <View style={[styles.map, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <View style={[styles.route, { borderColor: colors.textFaint }]} />
          <View style={[styles.pinStart, { backgroundColor: colors.text }]} />
          <LivePin color={colors.highlight} active={order.status === 'out'} />
          <View style={[styles.pinEnd, { backgroundColor: colors.success }]}>
            <Ionicons name="home" size={12} color="#FFFFFF" />
          </View>
          <View style={[styles.etaChip, { backgroundColor: colors.surface }]}>
            <Text style={[type.micro, { color: colors.textMuted }]}>{order.delivery === 'pickup' ? 'PICKUP' : 'COURIER'}</Text>
            <Text style={[type.labelStrong, { color: colors.text }]}>{eta}</Text>
          </View>
        </View>

        {/* Courier */}
        {order.delivery === 'courier' ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[type.h4, { color: colors.text }]}>JD</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyStrong, { color: colors.text }]}>Jordan · Courier</Text>
              <Text style={[type.caption, { color: colors.textMuted }]}>4.9 rating · Electric bike</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          </View>
        ) : null}

        {/* Timeline */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[type.h4, { color: colors.text }]}>Tracking</Text>
          <View style={{ marginTop: space.sm }}>
            {STATUS_ORDER.map((s, i) => {
              const done = i <= currentIndex;
              const current = i === currentIndex;
              return (
                <View key={s} style={{ flexDirection: 'row', gap: space.md }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={[styles.node, { backgroundColor: done ? colors.text : colors.surfaceAlt, borderColor: done ? colors.text : colors.border }]}>
                      {done ? <Ionicons name={STATUS_COPY[s].icon} size={12} color={colors.accentText} /> : null}
                    </View>
                    {i < STATUS_ORDER.length - 1 ? (
                      <View style={{ width: 2, flex: 1, minHeight: 34, backgroundColor: i < currentIndex ? colors.text : colors.border }} />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: i < STATUS_ORDER.length - 1 ? space.md : 0 }}>
                    <Text style={[type.bodyStrong, { color: done ? colors.text : colors.textFaint }]}>{STATUS_COPY[s].title}</Text>
                    <Text style={[type.caption, { color: done ? colors.textMuted : colors.textFaint }]}>
                      {current ? STATUS_COPY[s].body : done ? `Done · ${timeOf(order.createdAt)}` : 'Waiting'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Items + total */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[type.h4, { color: colors.text }]}>Items</Text>
          {order.lines.map((l, i) => {
            const p = getProduct(l.productId);
            if (!p) return null;
            return (
              <View key={l.key}>
                {i > 0 ? <Divider /> : null}
                <View style={styles.itemRow}>
                  <Image source={{ uri: p.images[0] }} style={styles.thumb} contentFit="cover" transition={150} />
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyStrong, { color: colors.text }]} numberOfLines={1}>{p.name}</Text>
                    <Text style={[type.caption, { color: colors.textMuted }]}>Size {l.size} · Qty {l.qty}</Text>
                  </View>
                  <Text style={[type.price, { color: colors.text }]}>{money(p.price * l.qty)}</Text>
                </View>
              </View>
            );
          })}
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: space.xs }}>
            <Text style={[type.bodyStrong, { color: colors.text }]}>All-in total</Text>
            <Text style={[type.h3, { color: colors.text }]}>{money(order.total)}</Text>
          </View>
          <Text style={[type.caption, { color: colors.textMuted }]}>
            {order.payment === 'cod' ? 'Pay on delivery' : 'Paid'} · Placed {timeOf(order.createdAt)}
          </Text>
        </View>

        <Button title="Continue shopping" variant="secondary" onPress={() => router.navigate('/(tabs)')} />
      </ScrollView>
    </Screen>
  );
}

function LivePin({ color, active }: { color: string; active: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  return (
    <View style={[styles.livePos]}>
      {active ? (
        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: color,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
            },
          ]}
        />
      ) : null}
      <View style={[styles.liveDot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 190, borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, overflow: 'hidden' },
  route: { position: 'absolute', left: '18%', right: '22%', top: '34%', bottom: '30%', borderWidth: 2, borderStyle: 'dashed', borderRadius: 40, transform: [{ rotate: '-8deg' }] },
  pinStart: { position: 'absolute', left: '18%', top: '62%', width: 12, height: 12, borderRadius: 6, marginLeft: -6, marginTop: -6 },
  pinEnd: { position: 'absolute', right: '20%', top: '28%', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  livePos: { position: 'absolute', left: '50%', top: '46%', width: 22, height: 22, marginLeft: -11, marginTop: -11, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  liveDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#FFFFFF' },
  etaChip: { position: 'absolute', left: space.md, bottom: space.md, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.md, gap: 2 },
  card: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, padding: space.md, gap: space.sm, flexDirection: 'column' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  node: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  thumb: { width: 52, height: 64, borderRadius: radius.sm, backgroundColor: '#EEE' },
});
