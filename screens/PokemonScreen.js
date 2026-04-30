import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';

export default function PokemonScreen() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPokemon = async () => {
    try {
      setLoading(true);

      // Pokémon aleatorio
      const randomId = Math.floor(Math.random() * 150) + 1;

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
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

  // 🎨 Color según tipo
  const getColor = (type) => {
    switch(type) {
      case 'fire': return '#F87171';
      case 'water': return '#60A5FA';
      case 'grass': return '#34D399';
      case 'electric': return '#FBBF24';
      case 'psychic': return '#F472B6';
      case 'ice': return '#67E8F9';
      case 'dragon': return '#A78BFA';
      case 'dark': return '#6B7280';
      case 'fairy': return '#F9A8D4';
      default: return '#A78BFA';
    }
  };

  if (loading) {
    return (
      <ActivityIndicator 
        size="large" 
        color="green" 
        style={{ flex: 1 }} 
      />
    );
  }

  return (
    <View style={[
      styles.container, 
      { backgroundColor: getColor(pokemon.types[0].type.name) }
    ]}>

      <Text style={styles.title}>
        {pokemon.name.toUpperCase()}
      </Text>

      <Image 
        source={{ uri: pokemon.sprites.front_default }} 
        style={styles.image} 
      />

      <Text style={styles.text}>Peso: {pokemon.weight}</Text>
      <Text style={styles.text}>Altura: {pokemon.height}</Text>

      {/* 🔥 Botón */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={fetchPokemon}
      >
        <Text style={styles.buttonText}>
          Actualizar Pokémon
        </Text>
      </TouchableOpacity>

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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF'
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10
  },
  text: {
    fontSize: 16,
    color: '#FFF'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00000080',
    padding: 12,
    borderRadius: 10
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});
