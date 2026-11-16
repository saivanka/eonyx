import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Chip, EmptyState, Screen, SectionHeader } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { products, trendingSearches } from '@/data/catalog';
import { useTheme } from '@/theme/ThemeContext';
import { gutter, radius, space, type } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';

const filters = ['All', 'Women', 'Men', 'Shoes', 'Bags', 'Outerwear', 'Accessories'] as const;
const filterToCategory: Record<string, string | null> = {
  All: null,
  Women: 'women',
  Men: 'men',
  Shoes: 'shoes',
  Bags: 'bags',
  Outerwear: 'outerwear',
  Accessories: 'accessories',
};

export default function Search() {
  const { colors } = useTheme();
  const width = useAppWidth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const gridWidth = (width - gutter * 2 - space.md) / 2;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = filterToCategory[filter];
    return products.filter((p) => {
      const matchesCat = !cat || p.category === cat;
      const matchesQ =
        !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, filter]);

  return (
    <Screen edges={['top']}>
      <View style={{ paddingHorizontal: gutter, paddingTop: space.sm }}>
        <Text style={[type.h1, { color: colors.text }]}>Search</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Brands, pieces, materials"
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { color: colors.text, fontFamily: 'Poppins_400Regular' }]}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter }}
        ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <ProductCard product={item} width={gridWidth} />}
        ListHeaderComponent={
          <View>
            <FlatList
              data={filters as unknown as string[]}
              horizontal
              keyExtractor={(f) => f}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, gap: space.xs, paddingTop: space.md }}
              renderItem={({ item }) => (
                <Chip label={item} selected={filter === item} onPress={() => setFilter(item as (typeof filters)[number])} />
              )}
            />
            {query.trim() === '' ? (
              <>
                <SectionHeader title="Trending" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, paddingHorizontal: gutter }}>
                  {trendingSearches.map((t) => (
                    <Pressable key={t} onPress={() => setQuery(t)} accessibilityRole="button">
                      <View style={[styles.trend, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                        <Ionicons name="trending-up" size={14} color={colors.highlight} />
                        <Text style={[type.label, { color: colors.text }]}>{t}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}
            <SectionHeader title={`${results.length} ${results.length === 1 ? 'piece' : 'pieces'}`} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Nothing matches that"
            body="Try a brand name, a material, or clear the filter."
            action={<Chip label="Clear search" selected onPress={() => { setQuery(''); setFilter('All'); }} />}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginTop: space.md,
    height: 50,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  input: { flex: 1, fontSize: 15, height: '100%' },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
