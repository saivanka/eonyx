import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, EmptyState, Header, Screen, Divider } from '@/components/ui';
import { BagLineView, DELIVERY_FEE, useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { money } from '@/lib/format';

export default function Bag() {
  const { colors } = useTheme();
  const { bagLines, subtotal, total, setQty, removeLine, state } = useStore();

  if (bagLines.length === 0) {
    return (
      <Screen edges={['top']}>
        <Header title="Bag" large />
        <EmptyState
          icon="bag-handle-outline"
          title="Your bag is empty"
          body="Anything you add to your bag shows up here."
          action={<Button title="Browse Discover" variant="secondary" onPress={() => router.navigate('/(tabs)')} />}
        />
      </Screen>
    );
  }

  const freeDelivery = state.delivery === 'courier' ? DELIVERY_FEE : 0;

  return (
    <Screen edges={['top']}>
      <Header title="Bag" large subtitle={`${bagLines.length} ${bagLines.length === 1 ? 'item' : 'items'}`} />
      <FlatList
        style={{ flex: 1 }}
        data={bagLines}
        keyExtractor={(l) => l.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: space.md }}
        ItemSeparatorComponent={() => <Divider inset />}
        renderItem={({ item }) => <BagRow line={item} onQty={(q) => setQty(item.key, q)} onRemove={() => removeLine(item.key)} />}
        ListFooterComponent={
          <View style={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.sm }}>
            <View style={[styles.refundNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="return-down-back-outline" size={18} color={colors.highlight} />
              <Text style={[type.caption, { color: colors.textMuted, flex: 1 }]}>
                Returns are free. Refund amount is shown before you pay.
              </Text>
            </View>
          </View>
        }
      />

      {/* Summary — all-in total, no hidden fees. Sits above the tab bar in normal flow. */}
      <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Courier pickup from your door" value={freeDelivery === 0 ? 'Free' : money(freeDelivery)} accent />
        <View style={[styles.totalLine, { backgroundColor: colors.border }]} />
        <View style={styles.totalRow}>
          <View>
            <Text style={[type.bodyStrong, { color: colors.text }]}>All-in total</Text>
            <Text style={[type.micro, { color: colors.textMuted }]}>Taxes and fees included</Text>
          </View>
          <Text style={[type.priceLg, { color: colors.text }]}>{money(total)}</Text>
        </View>
        <Button title="Checkout" icon="lock-closed-outline" onPress={() => router.push('/checkout/address')} />
      </View>
    </Screen>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[type.body, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[type.bodyStrong, { color: accent ? colors.success : colors.text }]}>{value}</Text>
    </View>
  );
}

function BagRow({ line, onQty, onRemove }: { line: BagLineView; onQty: (q: number) => void; onRemove: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.bagRow}>
      <Pressable onPress={() => router.push(`/product/${line.productId}`)} accessibilityRole="button">
        <Image source={{ uri: line.product.images[0] }} style={styles.thumb} contentFit="cover" transition={200} />
      </Pressable>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.micro, { color: colors.textMuted, textTransform: 'uppercase' }]}>{line.product.brand}</Text>
        <Text style={[type.bodyStrong, { color: colors.text }]} numberOfLines={2}>
          {line.product.name}
        </Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>Size {line.size}</Text>
        <View style={styles.qtyRow}>
          <View style={[styles.stepper, { borderColor: colors.border }]}>
            <Pressable onPress={() => onQty(line.qty - 1)} hitSlop={8} accessibilityLabel="Decrease quantity">
              <Ionicons name="remove" size={16} color={colors.text} />
            </Pressable>
            <Text style={[type.labelStrong, { color: colors.text, minWidth: 20, textAlign: 'center' }]}>{line.qty}</Text>
            <Pressable onPress={() => onQty(line.qty + 1)} hitSlop={8} accessibilityLabel="Increase quantity">
              <Ionicons name="add" size={16} color={colors.text} />
            </Pressable>
          </View>
          <Pressable onPress={onRemove} hitSlop={8} accessibilityRole="button">
            <Text style={[type.labelStrong, { color: colors.danger }]}>Remove</Text>
          </Pressable>
        </View>
      </View>
      <Text style={[type.price, { color: colors.text }]}>{money(line.lineTotal)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bagRow: { flexDirection: 'row', gap: space.md, paddingHorizontal: gutter, paddingVertical: space.md, alignItems: 'flex-start' },
  thumb: { width: 92, height: 116, borderRadius: radius.md, backgroundColor: '#EEE' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    height: 32,
  },
  refundNote: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  summary: {
    padding: gutter,
    paddingBottom: space.md,
    gap: space.sm,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLine: { height: StyleSheet.hairlineWidth, marginVertical: space.xs },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xs },
});
