import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Header, Screen } from '@/components/ui';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';

export default function Auth() {
  const { colors } = useTheme();
  const { signIn } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const valid = /^\S+@\S+\.\S+$/.test(email.trim());

  const submit = (guest: boolean) => {
    if (!valid) {
      setError('Enter a valid email address to continue.');
      return;
    }
    const displayName = name.trim() || email.split('@')[0];
    signIn(displayName, email.trim(), guest);
    router.back();
  };

  return (
    <Screen>
      <Header title="Sign in" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.lg, flex: 1 }}>
          <View>
            <Text style={[type.h1, { color: colors.text }]}>Welcome back.</Text>
            <Text style={[type.body, { color: colors.textMuted, marginTop: space.xs }]}>
              Sign in to sync your bag, saved pieces and orders across devices.
            </Text>
          </View>

          <Field label="Full name (optional)" value={name} onChangeText={setName} placeholder="Alex Morgan" />
          <Field
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(null);
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? (
            <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
          ) : null}

          <Button title="Continue with email" onPress={() => submit(false)} icon="mail-outline" />

          <View style={[styles.guestCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="flash-outline" size={20} color={colors.highlight} />
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyStrong, { color: colors.text }]}>Just checking out?</Text>
              <Text style={[type.caption, { color: colors.textMuted }]}>
                Guest checkout needs only your email. No password, no account.
              </Text>
            </View>
          </View>
          <Pressable onPress={() => submit(true)} accessibilityRole="button" style={styles.guestBtn}>
            <Text style={[type.labelStrong, { color: colors.text }]}>Continue as guest</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[type.labelStrong, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textFaint}
        {...props}
        style={[
          styles.input,
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, fontFamily: 'Poppins_400Regular' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: space.md,
    fontSize: 15,
  },
  guestCard: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'flex-start',
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  guestBtn: { alignItems: 'center', paddingVertical: space.sm },
});
