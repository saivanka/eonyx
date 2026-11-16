import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Divider } from '@/components/ui';
import { StepFrame } from '@/components/checkout/StepFrame';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { money } from '@/lib/format';

const paymentLabel = { cod: 'Cash on delivery', card: 'Debit or credit card', wallet: 'Digital wallet' } as const;
const deliveryLabel = { courier: 'Courier pickup from your door', pickup: 'Partner point pickup' } as const;

export default function ReviewStep() {
  const { colors } = useTheme();
  const { bagLines, subtotal, total, state, placeOrder } = useStore();
  const [placing, setPlacing] = useState(false);

  const place = () => {
    setPlacing(true);
    // Simulated network round-trip so the loading state reads as real.
    setTimeout(() => {
      const order = placeOrder();
      setPlacing(false);
      if (order) router.replace({ pathname: '/checkout/success', params: { id: order.id } });
    }, 900);
  };

  return (
    <StepFrame
      step={3}
      title="Check and place"
      body="This is the total you will pay. Nothing gets added later."
      footer={
        <View style={{ gap: space.sm }}>
          <View style={styles.totalRow}>
            <Text style={[type.bodyStrong, { color: colors.text }]}>All-in total</Text>
            <Text style={[type.priceLg, { color: colors.text }]}>{money(total)}</Text>
          </View>
          <Button title={`Place order · ${money(total)}`} icon="checkmark-circle-outline" loading={placing} onPress={place} disabled={bagLines.length === 0} />
        </View>
      }
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.md, paddingBottom: space.lg }} showsVerticalScrollIndicator={false}>
        {/* Items */}
        <Card title="Items">
          {bagLines.map((l, i) => (
            <View key={l.key}>
              {i > 0 ? <Divider /> : null}
              <View style={styles.itemRow}>
                <Image source={{ uri: l.product.images[0] }} style={styles.thumb} contentFit="cover" transition={150} />
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodyStrong, { color: colors.text }]} numberOfLines={1}>{l.product.name}</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>Size {l.size} · Qty {l.qty}</Text>
                </View>
                <Text style={[type.price, { color: colors.text }]}>{money(l.lineTotal)}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card title="Deliver to" action="Edit" onAction={() => router.navigate('/checkout/address')}>
          <Text style={[type.bodyStrong, { color: colors.text }]}>{state.address.fullName}</Text>
          <Text style={[type.body, { color: colors.textMuted }]}>{state.address.line1}, {state.address.city} {state.address.postcode}</Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>{state.address.phone}</Text>
          <View style={[styles.pill, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="cube-outline" size={14} color={colors.highlight} />
            <Text style={[type.captionStrong, { color: colors.text }]}>{deliveryLabel[state.delivery]} · Free</Text>
          </View>
        </Card>

        <Card title="Payment" action="Edit" onAction={() => router.navigate('/checkout/payment')}>
          <Text style={[type.bodyStrong, { color: colors.text }]}>{paymentLabel[state.payment]}</Text>
          {state.payment === 'cod' ? (
            <Text style={[type.caption, { color: colors.textMuted }]}>Have {money(total)} ready for the courier.</Text>
          ) : null}
        </Card>

        <Card title="Summary">
          <Line label="Subtotal" value={money(subtotal)} />
          <Line label="Delivery" value="Free" accent={colors.success} />
          <Divider />
          <Line label="All-in total" value={money(total)} strong />
        </Card>

        <View style={[styles.refund, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="return-down-back-outline" size={18} color={colors.highlight} />
          <Text style={[type.caption, { color: colors.textMuted, flex: 1 }]}>
            Free returns by courier pickup. Your refund amount is shown before you confirm.
          </Text>
        </View>
      </ScrollView>
    </StepFrame>
  );
}

function Card({ title, children, action, onAction }: { title: string; children: React.ReactNode; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHead}>
        <Text style={[type.overline, { color: colors.textMuted }]}>{title.toUpperCase()}</Text>
        {action ? (
          <Text onPress={onAction} style={[type.labelStrong, { color: colors.highlight }]}>{action}</Text>
        ) : null}
      </View>
      <View style={{ gap: 4 }}>{children}</View>
    </View>
  );
}

function Line({ label, value, accent, strong }: { label: string; value: string; accent?: string; strong?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 }}>
      <Text style={[strong ? type.bodyStrong : type.body, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[type.bodyStrong, { color: accent ?? colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, padding: space.md, gap: space.sm },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  thumb: { width: 56, height: 68, borderRadius: radius.sm, backgroundColor: '#EEE' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, marginTop: space.xs },
  refund: { flexDirection: 'row', gap: space.sm, alignItems: 'center', padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
