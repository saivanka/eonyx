import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/lib/haptics';
import { router } from 'expo-router';
import { Product } from '@/data/catalog';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { radius, space, type } from '@/theme/tokens';
import { money } from '@/lib/format';
import { Rating } from './ui';

export function ProductCard({ product, width }: { product: Product; width: number }) {
  const { colors } = useTheme();
  const { isSaved, toggleSave } = useStore();
  const saved = isSaved(product.id);
  const height = width * 1.32;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${money(product.price)}`}
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => ({ width, opacity: pressed ? 0.9 : 1 })}
    >
      <View style={[styles.media, { height, backgroundColor: colors.surfaceAlt, borderRadius: radius.lg }]}>
        <Image
          source={{ uri: product.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          recyclingKey={product.id}
        />
        {product.badge ? (
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[type.micro, { color: colors.text }]}>{product.badge}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save item'}
          hitSlop={10}
          onPress={() => {
            haptics.light();
            toggleSave(product.id);
          }}
          style={[styles.heart, { backgroundColor: colors.bg }]}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? colors.danger : colors.text} />
        </Pressable>
      </View>

      <View style={{ paddingTop: space.sm, gap: 2 }}>
        <Text style={[type.micro, { color: colors.textMuted, textTransform: 'uppercase' }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={[type.bodyStrong, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[type.price, { color: colors.text }]}>{money(product.price)}</Text>
          {product.compareAt ? (
            <Text style={[type.caption, styles.strike, { color: colors.textFaint }]}>{money(product.compareAt)}</Text>
          ) : null}
        </View>
        <Rating value={product.rating} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  media: { overflow: 'hidden' },
  badge: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heart: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs },
  strike: { textDecorationLine: 'line-through' },
});
