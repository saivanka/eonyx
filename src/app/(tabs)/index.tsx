import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, Screen, SectionHeader } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { categories, looks, products, Look } from '@/data/catalog';
import { useStore } from '@/store/StoreContext';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';

export default function Discover() {
  const { colors } = useTheme();
  const { bagCount, state } = useStore();
  const width = useAppWidth();
  const gridWidth = (width - gutter * 2 - space.md) / 2;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = state.user?.name.split(' ')[0];

  const newIn = useMemo(() => products.slice(0, 6), []);

  return (
    <Screen edges={['top']}>
      <FlatList
        data={newIn}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter }}
        ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} width={gridWidth} />}
        ListHeaderComponent={
          <View>
            {/* Top bar */}
            <View style={styles.topBar}>
              <View style={{ flex: 1 }}>
                <Text style={[type.caption, { color: colors.textMuted }]}>
                  {greeting}{firstName ? `, ${firstName}` : ''}
                </Text>
                <Text style={[type.h1, { color: colors.text }]}>Discover</Text>
              </View>
              <IconButton name="search" label="Search" onPress={() => router.push('/(tabs)/search')} />
              <IconButton name="bag-handle-outline" label="Bag" badge={bagCount} onPress={() => router.push('/(tabs)/bag')} />
            </View>

            {/* Edits / categories */}
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(c) => c.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md, paddingTop: space.md }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/category/${item.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`Shop ${item.name}`}
                  style={{ alignItems: 'center', width: 78, gap: space.xs }}
                >
                  <View style={[styles.circle, { borderColor: colors.highlight }]}>
                    <Image source={{ uri: item.image }} style={styles.circleImg} contentFit="cover" transition={200} />
                  </View>
                  <Text style={[type.captionStrong, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />

            {/* Shoppable looks */}
            <SectionHeader title="Shoppable looks" />
            <FlatList
              data={looks}
              horizontal
              pagingEnabled={false}
              snapToInterval={width * 0.82 + space.md}
              decelerationRate="fast"
              keyExtractor={(l) => l.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }}
              renderItem={({ item }) => <LookCard look={item} width={width * 0.82} />}
            />

            {/* Promise strip — the four findings from the case study, as product features */}
            <View style={[styles.promise, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {[
                { icon: 'cube-outline' as const, text: 'Free courier pickup' },
                { icon: 'cash-outline' as const, text: 'Pay on delivery' },
                { icon: 'receipt-outline' as const, text: 'One all-in total' },
              ].map((f, i) => (
                <React.Fragment key={f.text}>
                  {i > 0 ? <View style={[styles.promiseDivider, { backgroundColor: colors.border }]} /> : null}
                  <View style={styles.promiseItem}>
                    <Ionicons name={f.icon} size={18} color={colors.highlight} />
                    <Text style={[type.micro, { color: colors.text, textAlign: 'center' }]}>{f.text}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            <SectionHeader title="New in" action="See all" onAction={() => router.push('/category/women')} />
          </View>
        }
      />
    </Screen>
  );
}

function LookCard({ look, width }: { look: Look; width: number }) {
  const { colors } = useTheme();
  const height = width * 1.25;
  return (
    <View style={{ width }}>
      <View style={[styles.lookMedia, { height, borderRadius: radius.xl, backgroundColor: colors.surfaceAlt }]}>
        <Image source={{ uri: look.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />

        {look.hotspots.map((h) => {
          const product = products.find((p) => p.id === h.productId);
          if (!product) return null;
          return (
            <Pressable
              key={h.productId}
              accessibilityRole="button"
              accessibilityLabel={`Shop ${product.name}`}
              onPress={() => router.push(`/product/${product.id}`)}
              style={[styles.hotspot, { left: `${h.x}%`, top: `${h.y}%` }]}
              hitSlop={10}
            >
              <View style={styles.hotspotDot}>
                <Ionicons name="add" size={16} color="#121212" />
              </View>
            </Pressable>
          );
        })}

        <View style={styles.lookCopy}>
          <Text style={[type.overline, { color: '#D9B47E' }]}>SHOP THE LOOK</Text>
          <Text style={[type.h2, { color: '#FFFFFF', marginTop: 2 }]}>{look.title}</Text>
          <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 2 }]} numberOfLines={2}>
            {look.caption}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: gutter,
    paddingTop: space.sm,
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    padding: 3,
  },
  circleImg: { width: '100%', height: '100%', borderRadius: 30 },
  lookMedia: { overflow: 'hidden' },
  hotspot: { position: 'absolute', marginLeft: -16, marginTop: -16 },
  hotspotDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  lookCopy: { position: 'absolute', left: space.md, right: space.md, bottom: space.md },
  promise: {
    flexDirection: 'row',
    marginHorizontal: gutter,
    marginTop: space.xl,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingVertical: space.md,
  },
  promiseItem: { flex: 1, alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  promiseDivider: { width: StyleSheet.hairlineWidth, marginVertical: 4 },
});
