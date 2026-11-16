import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Divider, Screen, SectionHeader } from '@/components/ui';
import { ThemeMode, useTheme } from '@/theme/ThemeContext';
import { useStore } from '@/store/StoreContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { money, shortDate } from '@/lib/format';

const modes: { id: ThemeMode; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { id: 'light', label: 'Light', icon: 'sunny-outline' },
  { id: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function Profile() {
  const { colors, mode, setMode } = useTheme();
  const { state, signOut } = useStore();
  const user = state.user;
  const initials = user ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : 'G';

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: gutter, paddingTop: space.sm }}>
          <Text style={[type.h1, { color: colors.text }]}>Profile</Text>
        </View>

        {/* Identity */}
        <Pressable
          onPress={() => (user ? undefined : router.push('/auth'))}
          accessibilityRole="button"
          style={[styles.identity, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[type.h3, { color: colors.accentText }]}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h3, { color: colors.text }]}>{user ? user.name : 'Browsing as guest'}</Text>
            <Text style={[type.caption, { color: colors.textMuted }]}>
              {user ? (user.guest ? `${user.email} · guest` : user.email) : 'Sign in to keep orders in sync'}
            </Text>
          </View>
          {!user ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
        </Pressable>

        {/* Orders */}
        <SectionHeader title="Orders" />
        {state.orders.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[type.body, { color: colors.textMuted }]}>No orders yet. Your tracked deliveries will appear here.</Text>
          </View>
        ) : (
          <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {state.orders.map((o, i) => (
              <View key={o.id}>
                {i > 0 ? <Divider inset /> : null}
                <Row
                  icon="receipt-outline"
                  title={`${o.id} · ${money(o.total)}`}
                  subtitle={`${shortDate(o.createdAt)} · ${o.status === 'delivered' ? 'Delivered' : 'In progress'}`}
                  onPress={() => router.push(`/order/${o.id}`)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View style={[styles.segment, { backgroundColor: colors.surfaceAlt }]}>
          {modes.map((m) => {
            const active = mode === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => setMode(m.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[styles.segItem, active && { backgroundColor: colors.surface }]}
              >
                <Ionicons name={m.icon} size={16} color={active ? colors.text : colors.textMuted} />
                <Text style={[type.labelStrong, { color: active ? colors.text : colors.textMuted }]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Account & help */}
        <SectionHeader title="Shopping" />
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Row icon="location-outline" title="Delivery address" subtitle={`${state.address.line1}, ${state.address.city}`} />
          <Divider inset />
          <Row icon="return-down-back-outline" title="Returns" subtitle="Free courier pickup, refund shown up front" />
          <Divider inset />
          <Row icon="help-circle-outline" title="Help" subtitle="Delivery, sizing and returns" />
          <Divider inset />
          <Row icon="sparkles-outline" title="Welcome tour" subtitle="See how eonyx works" onPress={() => router.push('/welcome')} />
        </View>

        {user ? (
          <Pressable onPress={signOut} accessibilityRole="button" style={styles.signOut}>
            <Text style={[type.labelStrong, { color: colors.danger }]}>Sign out</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, title, subtitle, onPress }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; subtitle?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole={onPress ? 'button' : 'text'} style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyStrong, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[type.caption, { color: colors.textMuted }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginHorizontal: gutter, marginTop: space.md, padding: space.md, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  emptyCard: { marginHorizontal: gutter, padding: space.md, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2 },
  group: { marginHorizontal: gutter, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.md, paddingVertical: space.md },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  segment: { flexDirection: 'row', marginHorizontal: gutter, padding: 4, borderRadius: radius.pill, gap: 4 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, borderRadius: radius.pill },
  signOut: { alignItems: 'center', marginTop: space.xl, paddingVertical: space.md },
});
