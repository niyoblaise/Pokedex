import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { fetchPokemonDetail, PokemonDetail } from '../../api/pokeapi';
import { getTypeColor } from '../../utils/colors';
import TypeBadge from '../../components/TypeBadge';

export default function PokemonDetails() {
  const { id } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPokemonDetail(id as string)
        .then((data) => {
          setPokemon(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading || !pokemon) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#EE8130" />
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = getTypeColor(primaryType);

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen 
        options={{ 
          title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          headerStyle: { backgroundColor: bgColor },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
          <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        </View>
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          style={styles.image}
          contentFit="contain"
          transition={300}
        />
      </View>

      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { color: bgColor }]}>About</Text>
        
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: bgColor }]}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((a) => (
            <Text key={a.ability.name} style={styles.abilityText}>
              {a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)}
              {a.is_hidden && ' (Hidden)'}
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: bgColor }]}>Base Stats</Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{s.stat.name.toUpperCase()}</Text>
              <Text style={styles.statNum}>{s.base_stat.toString().padStart(3, '0')}</Text>
              <View style={styles.barBackground}>
                <View style={[
                  styles.barFill, 
                  { width: `${Math.min((s.base_stat / 255) * 100, 100)}%`, backgroundColor: bgColor }
                ]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  id: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  types: {
    flexDirection: 'row',
  },
  imageContainer: {
    alignItems: 'center',
    zIndex: 10,
    marginTop: -20,
  },
  image: {
    width: 250,
    height: 250,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 40,
    marginTop: -40,
    minHeight: 500,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  abilityText: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statName: {
    width: 80,
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins_700Bold',
  },
  statNum: {
    width: 40,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
