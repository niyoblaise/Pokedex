import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fetchPokemonDetail, PokemonDetail } from '../api/pokeapi';
import { getTypeColor } from '../utils/colors';
import TypeBadge from './TypeBadge';
import PokeballBg from './PokeballBg';

interface PokemonCardProps {
  name: string;
  url?: string;
  pokemon?: PokemonDetail; 
  index?: number;
}

export default function PokemonCard({ name, url, pokemon: initialPokemon, index = 0 }: PokemonCardProps) {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(initialPokemon || null);

  useEffect(() => {
    if (!initialPokemon && name) {
      fetchPokemonDetail(name).then(setPokemon).catch(console.error);
    }
  }, [name, initialPokemon]);

  if (!pokemon) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = getTypeColor(primaryType);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify().damping(15)}
      style={styles.cardContainer}
    >
      <Pressable 
        onPress={() => router.push(`/pokemon/${pokemon.id}`)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: bgColor },
          pressed && styles.cardPressed
        ]}
      >
        <PokeballBg style={styles.pokeballBg} color="rgba(255, 255, 255, 0.15)" />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </View>
        </View>
        <Image
          source={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          style={styles.image}
          contentFit="contain"
          transition={300}
        />
        <Text style={styles.idText}>#{pokemon.id.toString().padStart(3, '0')}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    height: 120,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loadingCard: {
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    borderRadius: 16,
  },
  loadingText: {
    color: '#94a3b8',
    fontFamily: 'Poppins_400Regular',
  },
  infoContainer: {
    flex: 1,
    zIndex: 2,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 90,
    height: 90,
    zIndex: 1,
  },
  idText: {
    position: 'absolute',
    top: 12,
    right: 12,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    zIndex: 2,
  },
  pokeballBg: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    zIndex: 0,
  }
});
