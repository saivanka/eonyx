import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, IconButton, Screen } from '@/components/ui';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, space, type } from '@/theme/tokens';

export const STEPS = ['Address', 'Delivery', 'Payment', 'Review'] as const;

// Shared chrome for the four checkout steps: progress, title, footer CTA.
export function StepFrame({
  step,
  title,
  body,
  children,
  footer,
}: {
  step: number; // 0-based
  title: string;
  body?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={styles.top}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <Text style={[type.labelStrong, { color: colors.textMuted }]}>
          Step {step + 1} of {STEPS.length}
        </Text>
        <IconButton name="close" label="Close checkout" onPress={() => router.navigate('/(tabs)/bag')} />
      </View>

      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flex: 1, gap: 6 }}>
            <View style={[styles.bar, { backgroundColor: i <= step ? colors.text : colors.border }]} />
            <Text style={[type.micro, { color: i === step ? colors.text : colors.textFaint }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: gutter, marginTop: space.lg }}>
        <Text style={[type.h1, { color: colors.text }]}>{title}</Text>
        {body ? <Text style={[type.body, { color: colors.textMuted, marginTop: space.xs }]}>{body}</Text> : null}
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View>
    </Screen>
  );
}

export function FooterCTA({ title, onPress, disabled, icon }: { title: string; onPress: () => void; disabled?: boolean; icon?: React.ComponentProps<typeof Ionicons>['name'] }) {
  return <Button title={title} onPress={onPress} disabled={disabled} icon={icon} />;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.md, paddingTop: space.xs },
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: gutter, marginTop: space.md },
  bar: { height: 4, borderRadius: 2 },
  footer: { paddingHorizontal: gutter, paddingTop: space.md, paddingBottom: space.md, borderTopWidth: StyleSheet.hairlineWidth * 2 },
});
