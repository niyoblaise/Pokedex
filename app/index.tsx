import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPokemons, PokemonListItem } from "../api/pokeapi";
import PokemonCard from "../components/PokemonCard";
import TypeFilter from "../components/TypeFilter";

export default function Index() {
  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [typeFilteredPokemons, setTypeFilteredPokemons] = useState<Set<string> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fethch pokemon list
    fetchPokemons(151, 0).then((data) => {
      setAllPokemons(data.results);
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setTypeFilteredPokemons(null);
      return;
    }

    // fetch pokemon on type based
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
      .then(res => res.json())
      .then(data => {
        const names = new Set<string>(data.pokemon.map((p: any) => p.pokemon.name));
        setTypeFilteredPokemons(names);
      })
      .catch(console.error);
  }, [selectedType]);

  const filteredPokemons = allPokemons.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilteredPokemons ? typeFilteredPokemons.has(p.name) : true;
    return matchesSearch && matchesType;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Pokédex",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: 'Poppins_700Bold', fontSize: 24 }
        }}
      />
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TypeFilter selectedType={selectedType} onSelect={setSelectedType} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#EE8130" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => <PokemonCard name={item.name} url={item.url} index={index} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No Pokémon found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#1e293b",
  },
  searchInput: {
    backgroundColor: "#334155",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#94a3b8",
    fontFamily: 'Poppins_500Medium',
  },
});
