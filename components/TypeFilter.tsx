import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native';
import { typeColors } from '../utils/colors';

const TYPES = [
  'All', 'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
  'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon',
  'Dark', 'Steel', 'Fairy'
];

interface TypeFilterProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function TypeFilter({ selectedType, onSelect }: TypeFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TYPES.map((type) => {
          const isSelected = selectedType === type.toLowerCase();
          const typeLower = type.toLowerCase();
          const bgColor = typeLower === 'all' 
            ? (isSelected ? '#fff' : '#334155') 
            : (isSelected ? typeColors[typeLower] : '#334155');

          return (
            <Pressable
              key={type}
              style={[
                styles.chip,
                { backgroundColor: bgColor },
                isSelected && styles.chipSelected
              ]}
              onPress={() => onSelect(typeLower)}
            >
              <Text style={[
                styles.chipText,
                { color: isSelected ? (typeLower === 'all' ? '#1e293b' : '#fff') : '#94a3b8' }
              ]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
});
