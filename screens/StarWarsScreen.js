import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar
} from 'react-native';

export default function StarWarsScreen() {

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // OBTENER PERSONAJES
  const fetchCharacters = async () => {

    try {

      const response = await fetch(
        'https://swapi.py4e.com/api/people/'
      );

      const data = await response.json();

      setCharacters(data.results);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  // OBTENER ID DEL PERSONAJE
  const getCharacterId = (url) => {

    const parts = url.split('/');

    return parts[parts.length - 2];
  };

  // PANTALLA DE CARGA
  if (loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#FFE81F"
        />

        <Text style={styles.loadingText}>
          Cargando galaxia...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      />

      {/* TÍTULO */}
      <Text style={styles.mainTitle}>
        STAR WARS
      </Text>

      {/* LISTA */}
      <FlatList
        data={characters}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30
        }}
        renderItem={({ item }) => {

          // ID PERSONAJE
          const characterId =
            getCharacterId(item.url);

          // URL IMAGEN
          const imageUrl =
            `https://raw.githubusercontent.com/akabab/starwars-api/0.2.1/api/id/${characterId}.jpg`;

          return (

            <View style={styles.card}>

              {/* FOTO */}
              <Image
                source={{
                  uri: imageUrl
                }}
                style={styles.image}
              />

              {/* INFORMACIÓN */}
              <View style={styles.infoContainer}>

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.info}>
                  👤 Género:
                  <Text style={styles.value}>
                    {' '}{item.gender}
                  </Text>
                </Text>

                <Text style={styles.info}>
                  📏 Altura:
                  <Text style={styles.value}>
                    {' '}{item.height} cm
                  </Text>
                </Text>

                <Text style={styles.info}>
                  ⚖️ Peso:
                  <Text style={styles.value}>
                    {' '}{item.mass} kg
                  </Text>
                </Text>

                <Text style={styles.info}>
                  🌌 Nacimiento:
                  <Text style={styles.value}>
                    {' '}{item.birth_year}
                  </Text>
                </Text>

              </View>

            </View>
          );
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: '#05070D',
    padding: 10
  },

  // CARGANDO
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadingText: {
    color: '#FFE81F',
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold'
  },

  // TÍTULO
  mainTitle: {
    color: '#FFE81F',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 4
  },

  // TARJETA
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFE81F',
    elevation: 6
  },

  // IMAGEN
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover'
  },

  // CONTENEDOR INFO
  infoContainer: {
    padding: 15
  },

  // NOMBRE
  name: {
    color: '#FFE81F',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12
  },

  // INFO
  info: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8
  },

  // VALORES
  value: {
    color: '#FFE81F',
    fontWeight: 'bold'
  }

});