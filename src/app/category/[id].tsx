import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Chip, EmptyState, Header, Screen } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { categories, productsByCategory, sortOptions, Product } from '@/data/catalog';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);
  const { colors } = useTheme();
  const width = useAppWidth();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>('Recommended');
  const gridWidth = (width - gutter * 2 - space.md) / 2;

  const items = useMemo<Product[]>(() => {
    const list = [...productsByCategory(id ?? '')];
    if (sort === 'Price: low to high') list.sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') list.sort((a, b) => b.price - a.price);
    if (sort === 'Top rated') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [id, sort]);

  return (
    <Screen>
      <Header title={category?.name ?? 'Shop'} />
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter }}
        ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
        contentContainerStyle={{ paddingBottom: space.xxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} width={gridWidth} />}
        ListHeaderComponent={
          <View>
            {category ? (
              <View style={[styles.hero, { borderRadius: radius.xl, backgroundColor: colors.surfaceAlt }]}>
                <Image source={{ uri: category.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
                <View style={styles.heroCopy}>
                  <Text style={[type.overline, { color: '#D9B47E' }]}>THE EDIT</Text>
                  <Text style={[type.h1, { color: '#FFFFFF' }]}>{category.name}</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)' }]}>
                    {items.length} {items.length === 1 ? 'piece' : 'pieces'}
                  </Text>
                </View>
              </View>
            ) : null}
            <FlatList
              data={sortOptions as unknown as string[]}
              horizontal
              keyExtractor={(s) => s}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.xs, paddingVertical: space.md }}
              renderItem={({ item }) => (
                <Chip label={item} selected={sort === item} onPress={() => setSort(item as (typeof sortOptions)[number])} />
              )}
            />
          </View>
        }
        ListEmptyComponent={<EmptyState icon="shirt-outline" title="Coming soon" body="New pieces land here every week." />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: gutter, height: 180, overflow: 'hidden', marginTop: space.xs },
  heroCopy: { position: 'absolute', left: space.lg, bottom: space.lg, gap: 2 },
});
