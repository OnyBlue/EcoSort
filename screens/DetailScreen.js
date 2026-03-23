import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailsScreen({ navigation, route }) {

  // Validación (por si no llegan datos)
  if (!route.params) {
    return (
      <View style={styles.container}>
        <Text>No hay datos disponibles</Text>
      </View>
    );
  }

  const { 
    tipo, 
    nivel, 
    estado,
    capacidad,
    ultimaRecoleccion
  } = route.params;

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.text}>📜 Detalle del contenedor</Text>

        <Text>Tipo: {tipo}</Text>
        <Text>Nivel: {nivel}%</Text>
        <Text>Estado: {estado}</Text>
        <Text>Capacidad: {capacidad}</Text>
        <Text>Última recolección: {ultimaRecoleccion}</Text>
      </View>

      <Button title="Volver" onPress={() => navigation.goBack()} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0' 
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    width: '80%'
  },

  text: { 
    fontSize: 18, 
    marginBottom: 10,
    fontWeight: 'bold'
  }
});
