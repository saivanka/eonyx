import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeContext';
import { radius, space, type, gutter } from '@/theme/tokens';

// ---------- Screen wrapper: background + safe area ----------
export function Screen({
  children,
  edges = ['top', 'bottom'],
  style,
}: {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      {children}
    </SafeAreaView>
  );
}

// ---------- Header ----------
export function Header({
  title,
  onBack,
  right,
  large,
  subtitle,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {onBack ? (
          <IconButton name="chevron-back" onPress={onBack} label="Back" />
        ) : (
          <View style={{ width: 40 }} />
        )}
        {!large && title ? (
          <Text style={[type.h3, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <View style={styles.headerRight}>{right ?? <View style={{ width: 40 }} />}</View>
      </View>
      {large && title ? (
        <View style={{ paddingHorizontal: gutter, marginTop: space.xs }}>
          <Text style={[type.h1, { color: colors.text }]}>{title}</Text>
          {subtitle ? <Text style={[type.body, { color: colors.textMuted, marginTop: 2 }]}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}


// ---------- Icon button (44pt hit target) ----------
export function IconButton({
  name,
  onPress,
  label,
  active,
  badge,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons name={name} size={20} color={active ? colors.highlight : colors.text} />
      {badge && badge > 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.highlight }]}>
          <Text style={[type.micro, { color: colors.accentText, fontSize: 10 }]}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// ---------- Button ----------
type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }: ButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const bg = isPrimary ? colors.accent : isGhost ? 'transparent' : colors.surface;
  const fg = isPrimary ? colors.accentText : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={() => {
        haptics.light();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: isPrimary || isGhost ? 'transparent' : colors.border,
          borderWidth: isPrimary || isGhost ? 0 : StyleSheet.hairlineWidth * 2,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={[type.button, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ---------- Chip ----------
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <Text style={[type.label, { color: selected ? colors.accentText : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

// ---------- Section header ----------
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionRow}>
      <Text style={[type.h2, { color: colors.text }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <Text style={[type.labelStrong, { color: colors.highlight }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------- Divider ----------
export function Divider({ inset }: { inset?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginLeft: inset ? gutter : 0,
      }}
    />
  );
}

// ---------- Stars ----------
export function Rating({ value, count }: { value: number; count?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name="star" size={12} color={colors.highlight} />
      <Text style={[type.captionStrong, { color: colors.text }]}>{value.toFixed(1)}</Text>
      {count !== undefined ? (
        <Text style={[type.caption, { color: colors.textMuted }]}>({count})</Text>
      ) : null}
    </View>
  );
}

// ---------- Empty state ----------
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 40, paddingVertical: 48, gap: space.sm }}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={28} color={colors.text} />
      </View>
      <Text style={[type.h3, { color: colors.text, textAlign: 'center', marginTop: space.sm }]}>{title}</Text>
      <Text style={[type.body, { color: colors.textMuted, textAlign: 'center' }]}>{body}</Text>
      {action ? <View style={{ marginTop: space.md }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: space.xs, paddingBottom: space.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, minHeight: 44 },
  headerRight: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: space.xs },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  button: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: gutter,
    marginTop: space.xl,
    marginBottom: space.md,
  },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
