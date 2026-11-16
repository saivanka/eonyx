import React, { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAppWidth } from '@/lib/layout';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { looks, photo } from '@/data/catalog';
import { fonts, space, type } from '@/theme/tokens';

const slides = [
  {
    id: 's1',
    image: looks[0].image,
    overline: 'Shop the look',
    title: 'Every look, one tap\nto the bag.',
    body: 'Outfits from independent labels and the brands you already know.',
  },
  {
    id: 's2',
    image: looks[2].image,
    overline: 'Quick checkout',
    title: 'Four short steps.\nOne clear total.',
    body: 'No hidden fees. Pay on delivery if you prefer, and check out as a guest with just your email.',
  },
  {
    id: 's3',
    image: photo('photo-1483985988355-763728e1935b'),
    overline: 'Free returns',
    title: 'Courier pickup\nfrom your door.',
    body: 'Returns are free. You see the refund amount before you buy.',
  },
];

export default function Welcome() {
  const width = useAppWidth();
  const { height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewable = useRef(({ viewableItems }: { viewableItems: Array<{ index?: number | null }> }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0C' }}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.92)']}
              locations={[0.3, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.copy}>
              <Text style={[type.overline, { color: '#D9B47E' }]}>{item.overline.toUpperCase()}</Text>
              <Text style={[type.display, { color: '#FFFFFF', marginTop: space.xs }]}>{item.title}</Text>
              <Text style={[type.bodyLg, { color: 'rgba(255,255,255,0.78)', marginTop: space.sm }]}>{item.body}</Text>
            </View>
          </View>
        )}
      />

      <SafeAreaView edges={['top', 'bottom']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          <Text style={styles.wordmark}>EONYX</Text>
          <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12} accessibilityRole="button">
            <Text style={[type.labelStrong, { color: 'rgba(255,255,255,0.8)' }]}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((s, i) => (
              <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
          <Button title={index === slides.length - 1 ? 'Start shopping' : 'Continue'} onPress={next} />
          <Pressable
            onPress={() => router.push('/auth')}
            accessibilityRole="button"
            style={styles.secondary}
            hitSlop={8}
          >
            <Text style={[type.bodyStrong, { color: 'rgba(255,255,255,0.85)' }]}>I already have an account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 230,
  },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: space.sm,
  },
  wordmark: { fontFamily: fonts.bold, fontSize: 18, letterSpacing: 6, color: '#FFFFFF' },
  footer: { paddingHorizontal: 24, paddingBottom: space.md, gap: space.md },
  dots: { flexDirection: 'row', gap: 6, marginBottom: space.xs },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 22, backgroundColor: '#FFFFFF' },
  secondary: { alignItems: 'center', paddingVertical: space.xs },
});
