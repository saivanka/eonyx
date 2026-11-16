import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FooterCTA, StepFrame } from '@/components/checkout/StepFrame';
import { useStore, Address } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';

export default function AddressStep() {
  const { colors } = useTheme();
  const { state, setAddress, signIn } = useStore();
  const [addr, setAddr] = useState<Address & { email: string }>({
    ...state.address,
    email: state.user?.email ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const isGuest = state.user === null;

  const update = (key: keyof (Address & { email: string }), value: string) => {
    setAddr((a) => ({ ...a, [key]: value }));
    setError(null);
  };

  const onContinue = () => {
    const required: (keyof Address)[] = ['fullName', 'line1', 'city', 'postcode', 'phone'];
    if (required.some((k) => !addr[k].trim())) return setError('Please fill in every address field.');
    if (isGuest && !/^\S+@\S+\.\S+$/.test(addr.email.trim())) return setError('Add an email so we can send tracking.');
    const { email, ...address } = addr;
    setAddress(address);
    if (isGuest) signIn(address.fullName.split(' ')[0], email.trim(), true);
    router.push('/checkout/delivery');
  };

  return (
    <StepFrame
      step={0}
      title="Where should we send it?"
      body="Your address is saved on this device only."
      footer={<FooterCTA title="Continue to delivery" onPress={onContinue} icon="arrow-forward" />}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.md, paddingBottom: space.xl }} keyboardShouldPersistTaps="handled">
          {isGuest ? (
            <View style={[styles.guest, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="flash-outline" size={18} color={colors.highlight} />
              <Text style={[type.caption, { color: colors.textMuted, flex: 1 }]}>
                Guest checkout. Your email is all we need for tracking. No account, no password.
              </Text>
            </View>
          ) : null}
          {isGuest ? <Input label="Email" value={addr.email} onChange={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" /> : null}
          <Input label="Full name" value={addr.fullName} onChange={(v) => update('fullName', v)} placeholder="Alex Morgan" />
          <Input label="Address" value={addr.line1} onChange={(v) => update('line1', v)} placeholder="Street and flat number" />
          <View style={{ flexDirection: 'row', gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Input label="City" value={addr.city} onChange={(v) => update('city', v)} placeholder="London" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Postcode" value={addr.postcode} onChange={(v) => update('postcode', v)} placeholder="E8 3RP" autoCapitalize="characters" />
            </View>
          </View>
          <Input label="Phone" value={addr.phone} onChange={(v) => update('phone', v)} keyboardType="phone-pad" placeholder="+44 7700 900123" />
          {error ? <Text style={[type.caption, { color: colors.danger }]}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </StepFrame>
  );
}

function Input({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<typeof TextInput>, 'onChange'>) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[type.labelStrong, { color: colors.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor={colors.textFaint}
        {...rest}
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, fontFamily: 'Poppins_400Regular' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { height: 52, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, paddingHorizontal: space.md, fontSize: 15 },
  guest: { flexDirection: 'row', gap: space.sm, alignItems: 'center', padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2 },
});
