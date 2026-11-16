import React from 'react';
import { FlatList, View, } from 'react-native';
import { router } from 'expo-router';
import { EmptyState, Header, Screen, Button } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { getProduct } from '@/data/catalog';
import { useStore } from '@/store/StoreContext';
import { gutter, space } from '@/theme/tokens';
import { useAppWidth } from '@/lib/layout';

export default function Saved() {
  const { state } = useStore();
  const width = useAppWidth();
  const gridWidth = (width - gutter * 2 - space.md) / 2;
  const items = state.saved.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Screen edges={['top']}>
      <Header title="Saved" large subtitle={`${items.length} ${items.length === 1 ? 'piece' : 'pieces'} you are considering`} />
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter }}
        ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: space.md }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} width={gridWidth} />}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Nothing saved yet"
            body="Tap the heart on any piece to keep it here."
            action={<Button title="Find something" variant="secondary" onPress={() => router.navigate('/(tabs)')} />}
          />
        }
      />
    </Screen>
  );
}
