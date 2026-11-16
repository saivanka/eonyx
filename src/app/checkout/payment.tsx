import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FooterCTA, StepFrame } from '@/components/checkout/StepFrame';
import { PaymentMethod, useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';

const options: {
  id: PaymentMethod;
  title: string;
  body: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  badge?: string;
}[] = [
  {
    id: 'cod',
    title: 'Cash on delivery',
    body: 'Pay the courier when the parcel arrives. Card or cash.',
    icon: 'cash-outline',
    badge: 'Recommended',
  },
  {
    id: 'card',
    title: 'Debit or credit card',
    body: 'Charged once your order is dispatched.',
    icon: 'card-outline',
  },
  {
    id: 'wallet',
    title: 'Digital wallet',
    body: 'Pay with the wallet already on your phone.',
    icon: 'wallet-outline',
  },
];

export default function PaymentStep() {
  const { colors } = useTheme();
  const { state, setPayment } = useStore();

  return (
    <StepFrame
      step={2}
      title="How would you like to pay?"
      body="Cash on delivery is preselected because it is the simplest way to start."
      footer={<FooterCTA title="Review order" onPress={() => router.push('/checkout/review')} icon="arrow-forward" />}
    >
      <View style={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.md }}>
        {options.map((o) => {
          const selected = state.payment === o.id;
          return (
            <Pressable
              key={o.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPayment(o.id)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? colors.text : colors.border,
                  borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth * 2,
                },
              ]}
            >
              <Ionicons name={o.icon} size={22} color={colors.text} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <Text style={[type.bodyStrong, { color: colors.text }]}>{o.title}</Text>
                  {o.badge ? (
                    <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
                      <Text style={[type.micro, { color: colors.highlight }]}>{o.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[type.caption, { color: colors.textMuted }]}>{o.body}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? colors.text : colors.border }]}>
                {selected ? <View style={[styles.radioDot, { backgroundColor: colors.text }]} /> : null}
              </View>
            </Pressable>
          );
        })}
        <Text style={[type.caption, { color: colors.textFaint, marginTop: space.sm }]}>
          No card details are stored in this prototype.
        </Text>
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: space.md, alignItems: 'center', padding: space.md, borderRadius: radius.lg },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
