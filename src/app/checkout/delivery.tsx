import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FooterCTA, StepFrame } from '@/components/checkout/StepFrame';
import { DeliveryMethod, useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';

const options: {
  id: DeliveryMethod;
  title: string;
  body: string;
  eta: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  {
    id: 'courier',
    title: 'Courier pickup from your door',
    body: 'We collect your return from your door too. Refund shown before you pay.',
    eta: 'Arrives in 1–2 days',
    icon: 'bicycle-outline',
  },
  {
    id: 'pickup',
    title: 'Collect from a partner point',
    body: 'Pick up from a shop near you, usually within a few hours of dispatch.',
    eta: 'Ready in about 4 hours',
    icon: 'storefront-outline',
  },
];

export default function DeliveryStep() {
  const { colors } = useTheme();
  const { state, setDelivery } = useStore();

  return (
    <StepFrame
      step={1}
      title="How should it arrive?"
      body="Both options are free. You will see one total at the end."
      footer={<FooterCTA title="Continue to payment" onPress={() => router.push('/checkout/payment')} icon="arrow-forward" />}
    >
      <View style={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.md }}>
        {options.map((o) => {
          const selected = state.delivery === o.id;
          return (
            <Pressable
              key={o.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setDelivery(o.id)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? colors.text : colors.border,
                  borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth * 2,
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={o.icon} size={22} color={colors.text} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.titleRow}>
                  <Text style={[type.bodyStrong, { color: colors.text, flex: 1 }]}>{o.title}</Text>
                  <Text style={[type.price, { color: colors.success }]}>Free</Text>
                </View>
                <Text style={[type.caption, { color: colors.textMuted }]}>{o.body}</Text>
                <Text style={[type.captionStrong, { color: colors.highlight }]}>{o.eta}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? colors.text : colors.border }]}>
                {selected ? <View style={[styles.radioDot, { backgroundColor: colors.text }]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', padding: space.md, borderRadius: radius.lg },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
