import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function PokemonScreen() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPokemon = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>
      <Image 
        source={{ uri: pokemon.sprites.front_default }} 
        style={styles.image} 
      />
      <Text>Peso: {pokemon.weight}</Text>
      <Text>Altura: {pokemon.height}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  image: {
    width: 150,
    height: 150
  }
});

