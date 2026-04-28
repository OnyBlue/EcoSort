import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';

export default function RickMortyScreen({ navigation }) {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then(response => response.json())
      .then(data => {
        setPersonajes(data.results);
        setCargando(false);
      })
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>{item.species} - {item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    
      
      <Text style={styles.title}>PERSONAJES DE RICK Y MORTY</Text>
      
      {cargando ? (
        <Text>Cargando multiverso... perra!</Text>
      ) : (
        <FlatList
          data={personajes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  backButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 10, alignSelf: 'flex-start' },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center', elevation: 2 },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  status: { color: '#718096' }
});