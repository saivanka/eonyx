import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/lib/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Chip, EmptyState, Rating, Screen, SectionHeader } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { getProduct, productsByCategory } from '@/data/catalog';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { money } from '@/lib/format';
import { useAppWidth } from '@/lib/layout';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const { colors } = useTheme();
  const { addToBag, toggleSave, isSaved, bagCount } = useStore();
  const width = useAppWidth();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const related = useMemo(
    () => (product ? productsByCategory(product.category).filter((p) => p.id !== product.id) : []),
    [product],
  );

  if (!product) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Piece not found" body="It may have sold out." action={<Button title="Back" variant="secondary" onPress={() => router.back()} />} />
      </Screen>
    );
  }

  const selectedSize = size ?? product.sizes[0];
  const saved = isSaved(product.id);
  const imageHeight = width * 1.24;
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  const onAdd = () => {
    addToBag(product.id, selectedSize);
    haptics.success();
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Screen edges={['bottom']} style={{ backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Gallery */}
        <View>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri) => uri}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width, height: imageHeight, backgroundColor: colors.surfaceAlt }} contentFit="cover" transition={250} />
            )}
          />
          <View style={[styles.topActions, { top: insets.top + space.xs }]}>
            <RoundButton icon="chevron-back" label="Back" onPress={() => router.back()} />
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <RoundButton
                icon={saved ? 'heart' : 'heart-outline'}
                label={saved ? 'Remove from saved' : 'Save'}
                tint={saved ? colors.danger : undefined}
                onPress={() => toggleSave(product.id)}
              />
              <RoundButton icon="bag-handle-outline" label="Bag" badge={bagCount} onPress={() => router.push('/(tabs)/bag')} />
            </View>
          </View>
          {product.images.length > 1 ? (
            <View style={styles.pager}>
              {product.images.map((_, i) => (
                <View key={i} style={[styles.pagerDot, { backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.45)', width: i === index ? 18 : 6 }]} />
              ))}
            </View>
          ) : null}
        </View>

        {/* Info */}
        <View style={{ paddingHorizontal: gutter, paddingTop: space.lg, gap: space.xs }}>
          <Text style={[type.micro, { color: colors.highlight, textTransform: 'uppercase' }]}>{product.brand}</Text>
          <Text style={[type.h1, { color: colors.text }]}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={[type.priceLg, { color: colors.text }]}>{money(product.price)}</Text>
            {product.compareAt ? (
              <>
                <Text style={[type.body, { color: colors.textFaint, textDecorationLine: 'line-through' }]}>{money(product.compareAt)}</Text>
                <View style={[styles.offTag, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[type.captionStrong, { color: colors.success }]}>-{off}%</Text>
                </View>
              </>
            ) : null}
          </View>
          <Rating value={product.rating} count={product.reviews} />
        </View>

        {/* Size */}
        <View style={{ paddingHorizontal: gutter, marginTop: space.xl }}>
          <View style={styles.sizeHeader}>
            <Text style={[type.h4, { color: colors.text }]}>Size</Text>
            <Text style={[type.labelStrong, { color: colors.highlight }]}>Size guide</Text>
          </View>
          <View style={styles.sizes}>
            {product.sizes.map((s) => (
              <Chip key={s} label={s} selected={s === selectedSize} onPress={() => setSize(s)} />
            ))}
          </View>
        </View>

        {/* Delivery promises — the case study's four findings */}
        <View style={[styles.promiseCard, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: gutter }]}>
          <PromiseRow icon="cube-outline" title="Free courier pickup from your door" body="Choose it at checkout. No delivery fee." />
          <PromiseRow icon="return-down-back-outline" title="Free returns, refund shown up front" body="You see the refund amount before you buy." />
          <PromiseRow icon="cash-outline" title="Cash on delivery available" body="Pay the courier when the parcel arrives." last />
        </View>

        {/* Description + details */}
        <View style={{ paddingHorizontal: gutter, marginTop: space.xl, gap: space.md }}>
          <Text style={[type.h4, { color: colors.text }]}>About this piece</Text>
          <Text style={[type.body, { color: colors.textMuted }]}>{product.description}</Text>
          <View style={{ gap: space.xs, marginTop: space.xs }}>
            {product.details.map((d) => (
              <View key={d} style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
                <View style={[styles.bullet, { backgroundColor: colors.highlight }]} />
                <Text style={[type.body, { color: colors.text }]}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {related.length > 0 ? (
          <>
            <SectionHeader title="You may also like" />
            <FlatList
              data={related}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }}
              renderItem={({ item }) => <ProductCard product={item} width={width * 0.42} />}
            />
          </>
        ) : null}
      </ScrollView>

      {/* Sticky add-to-bag bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: insets.bottom + space.sm }]}>
        <View>
          <Text style={[type.micro, { color: colors.textMuted }]}>Total</Text>
          <Text style={[type.h3, { color: colors.text }]}>{money(product.price)}</Text>
        </View>
        <Button
          title={added ? 'Added to bag' : 'Add to bag'}
          icon={added ? 'checkmark' : 'bag-add-outline'}
          onPress={onAdd}
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

function PromiseRow({ icon, title, body, last }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; body: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.promiseRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Ionicons name={icon} size={20} color={colors.highlight} />
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyStrong, { color: colors.text }]}>{title}</Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>{body}</Text>
      </View>
    </View>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
  badge,
  tint,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  badge?: number;
  tint?: string;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} style={styles.round}>
      <Ionicons name={icon} size={20} color={tint ?? '#121212'} />
      {badge && badge > 0 ? (
        <View style={styles.roundBadge}>
          <Text style={styles.roundBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topActions: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  round: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A8844A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  roundBadgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Poppins_600SemiBold' },
  pager: {
    position: 'absolute',
    bottom: space.md,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  pagerDot: { height: 6, borderRadius: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.xs },
  offTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  promiseCard: { marginTop: space.xl, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, paddingHorizontal: space.md },
  promiseRow: { flexDirection: 'row', gap: space.md, alignItems: 'center', paddingVertical: space.md },
  bullet: { width: 5, height: 5, borderRadius: 3 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: gutter,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
});
